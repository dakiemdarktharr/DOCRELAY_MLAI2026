import { MongoClient, MongoServerError, type Db } from "mongodb";
import type { SupportRequest } from "@/domain/contracts";

export class SupportError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
type Document = { _id: string; data: SupportRequest };
type Runtime = {
  supportV3Requests?: Map<string, SupportRequest>;
  supportV3Mongo?: MongoClient;
  supportV3Budget?: number;
  supportV3IndexReady?: Promise<string>;
};
const runtime = globalThis as typeof globalThis & Runtime;
function memory() {
  return (runtime.supportV3Requests ??= new Map());
}
function database() {
  if (process.env.MONGODB_URI) {
    runtime.supportV3Mongo ??= new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 3,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    return runtime.supportV3Mongo.db(
      process.env.MONGODB_DB || "mlai26_support_v3_demo",
    );
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SUPPORT_STORAGE !== "memory-demo"
  )
    throw new SupportError(
      "STORAGE_UNAVAILABLE",
      "Cần cấu hình MongoDB để lưu workflow.",
      503,
    );
  return null;
}
function supportRequests(db: Db) {
  return db.collection<Document>("v3_support_requests");
}
async function ensureSupportRequestIndex(db: Db) {
  if (!runtime.supportV3IndexReady) {
    const creating = supportRequests(db).createIndex({ "data.updatedAt": -1 });
    runtime.supportV3IndexReady = creating.catch((error) => {
      runtime.supportV3IndexReady = undefined;
      throw error;
    });
  }
  await runtime.supportV3IndexReady;
}
export function supportStorageMode() {
  return process.env.MONGODB_URI ? "MONGODB" : "MEMORY_DEMO";
}
export async function getSupportRequest(
  id: string,
): Promise<SupportRequest | null> {
  const db = database();
  const row = db
    ? (
        await supportRequests(db).findOne({ _id: id })
      )?.data
    : memory().get(id);
  return row ? structuredClone(row) : null;
}
export async function listSupportRequests(): Promise<SupportRequest[]> {
  const db = database();
  if (db) {
    await ensureSupportRequestIndex(db);
    return (
      await supportRequests(db)
        .find()
        .sort({ "data.updatedAt": -1 })
        .limit(200)
        .toArray()
    ).map((row) => row.data);
  }
  return structuredClone(
    [...memory().values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 200),
  );
}
export async function insertSupportRequest(
  request: SupportRequest,
): Promise<boolean> {
  const db = database();
  if (db) {
    try {
      await supportRequests(db)
        .insertOne({ _id: request.id, data: request });
      return true;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000)
        return false;
      throw error;
    }
  }
  if (memory().has(request.id)) return false;
  memory().set(request.id, structuredClone(request));
  return true;
}
// Request, assistance history and audit events are embedded in one atomic Mongo document.
export async function updateSupportRequest(
  id: string,
  version: number,
  update: (request: SupportRequest) => void,
): Promise<SupportRequest> {
  const existing = await getSupportRequest(id);
  if (!existing)
    throw new SupportError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
  if (existing.version !== version)
    throw new SupportError(
      "VERSION_CONFLICT",
      "Yêu cầu đã thay đổi. Tải lại trước khi thao tác.",
      409,
    );
  const draft = structuredClone(existing);
  update(draft);
  draft.version = version + 1;
  draft.updatedAt = new Date().toISOString();
  const db = database();
  if (db) {
    const result = await db
      .collection<Document>("v3_support_requests")
      .replaceOne({ _id: id, "data.version": version }, { data: draft });
    if (!result.matchedCount)
      throw new SupportError(
        "VERSION_CONFLICT",
        "Yêu cầu đã thay đổi. Tải lại.",
        409,
      );
  } else {
    if (memory().get(id)?.version !== version)
      throw new SupportError(
        "VERSION_CONFLICT",
        "Yêu cầu đã thay đổi. Tải lại.",
        409,
      );
    memory().set(id, structuredClone(draft));
  }
  return structuredClone(draft);
}
export async function reserveModelAttempt(): Promise<boolean> {
  const db = database();
  const configured = Number(process.env.AI_MAX_ATTEMPTS ?? 20);
  const limit =
    Number.isInteger(configured) && configured >= 0
      ? Math.min(configured, 20)
      : 0;
  if (db) {
    const budgets = db.collection<{ _id: string; attempts: number }>(
      "v3_model_budgets",
    );
    try {
      await budgets.updateOne(
        { _id: "lifetime" },
        { $setOnInsert: { attempts: 0 } },
        { upsert: true },
      );
    } catch (error) {
      if (!(error instanceof MongoServerError) || error.code !== 11000)
        throw error;
    }
    return Boolean(
      await budgets.findOneAndUpdate(
        { _id: "lifetime", attempts: { $lt: limit } },
        { $inc: { attempts: 1 } },
        { returnDocument: "after" },
      ),
    );
  }
  if ((runtime.supportV3Budget ?? 0) >= limit) return false;
  runtime.supportV3Budget = (runtime.supportV3Budget ?? 0) + 1;
  return true;
}
export function resetSupportTestStore() {
  if (process.env.NODE_ENV !== "test") throw new Error("TEST_ONLY");
  runtime.supportV3Requests = new Map();
  runtime.supportV3Budget = 0;
  runtime.supportV3IndexReady = undefined;
}

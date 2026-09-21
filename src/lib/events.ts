import { randomUUID } from "node:crypto";
import { supportDatabase } from "./support-repository";
import { Prisma } from "@prisma/client";
import { getPrismaClient, type GenericEvent } from "@/lib/db";

export type RecordEventInput = {
  type: string;
  actor: string;
  metadata?: Prisma.InputJsonObject;
};

// The memory store keeps the app usable before PostgreSQL is configured locally.
// Production with DATABASE_URL always uses Prisma and therefore persists events.
const memoryEvents: GenericEvent[] = [];

export async function recordEvent({
  type,
  actor,
  metadata = {},
}: RecordEventInput) {
  if (process.env.MONGODB_URI) {
    const event: GenericEvent = {
      id: randomUUID(),
      type,
      actor,
      metadata: metadata as Prisma.JsonValue,
      createdAt: new Date(),
    };
    await supportDatabase()!
      .collection<GenericEvent>("legacy_events")
      .insertOne(event);
    return event;
  }
  if (process.env.DATABASE_URL) {
    return getPrismaClient().event.create({
      data: { type, actor, metadata },
    });
  }

  const event: GenericEvent = {
    id: `memory-${Date.now()}-${memoryEvents.length + 1}`,
    type,
    actor,
    metadata: metadata as unknown as Prisma.JsonValue,
    createdAt: new Date(),
  };
  memoryEvents.unshift(event);
  return event;
}

export async function listEvents(limit = 100) {
  if (process.env.MONGODB_URI)
    return supportDatabase()!
      .collection<GenericEvent>("legacy_events")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  if (process.env.DATABASE_URL) {
    return getPrismaClient().event.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  return memoryEvents.slice(0, limit);
}

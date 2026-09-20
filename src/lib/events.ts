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
  if (process.env.DATABASE_URL) {
    return getPrismaClient().event.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  return memoryEvents.slice(0, limit);
}

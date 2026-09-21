import {
  knowledgeSeed,
  supersededKnowledgeIds,
  type KnowledgeArticle,
} from "@/domain/knowledge";
import type { ConversationLabel } from "@/domain/conversation";
import { normalize } from "@/domain/text";
import { supportDatabase } from "./support-repository";

export function rankKnowledge(
  rows: KnowledgeArticle[],
  question: string,
  label: ConversationLabel,
  now = Date.now(),
) {
  const text = normalize(question);
  const words = new Set(
    text.split(/[^a-z0-9]+/).filter((word) => word.length > 2),
  );
  return rows
    .filter(
      (row) =>
        !supersededKnowledgeIds.includes(row._id) &&
        Date.parse(row.expiresAt) > now,
    )
    .map((row) => ({
      row,
      score:
        (row.label === label ? 8 : 0) +
        row.keywords.reduce(
          (score, keyword) =>
            score + (text.includes(normalize(keyword)) ? 2 : 0),
          0,
        ) +
        normalize(row.title)
          .split(" ")
          .filter((word) => words.has(word)).length,
    }))
    .filter((item) => item.score >= 8)
    .sort((a, b) => b.score - a.score || a.row._id.localeCompare(b.row._id))
    .slice(0, 3)
    .map((item) => item.row);
}
let seeded: Promise<void> | undefined;
export async function retrieveKnowledge(
  question: string,
  label: ConversationLabel,
) {
  const db = supportDatabase();
  if (!db)
    return {
      articles: rankKnowledge(knowledgeSeed, question, label),
      storage: "memory" as const,
    };
  const collection = db.collection<KnowledgeArticle>("v3_support_knowledge");
  // Immutable, reviewed seed versions only. Never turn user/model/web text into approved knowledge.
  seeded ??= (async () => {
    await collection.createIndex({ label: 1, expiresAt: 1 });
    await collection.bulkWrite(
      knowledgeSeed.map((article) => ({
        updateOne: {
          filter: { _id: article._id },
          update: { $setOnInsert: article },
          upsert: true,
        },
      })),
    );
  })().catch((error) => {
    seeded = undefined;
    throw error;
  });
  await seeded;
  const rows = await collection
    .find({
      label,
      _id: { $nin: supersededKnowledgeIds },
      expiresAt: { $gt: new Date().toISOString() },
    })
    .limit(50)
    .toArray();
  return {
    articles: rankKnowledge(rows, question, label),
    storage: "mongodb" as const,
  };
}

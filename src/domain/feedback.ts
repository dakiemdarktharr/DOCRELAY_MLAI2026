import { normalize } from "./text";

export type FeedbackSentiment = "positive" | "neutral" | "negative";

const negativePatterns = [
  /\b(?:ban ngu|ngu phet|khong hieu toi noi gi|bat luc|that vong|qua buc minh|vo ich|khong giai quyet duoc)\b/,
  /\b(?:chuyen|noi|ket noi|transfer|connect).{0,35}\b(?:nhan vien|nguoi ho tro|it support|human|agent|support|employee|staff member)\b/,
  /\b(?:need a human|speak to support|you do not understand me|are you even listening|useless|frustrated|helpless)\b/,
];

const resolvedPatterns = [
  /\b(?:da lam duoc|khong con bi loi|vao duoc|da dang nhap duoc|da on|da hoat dong|fixed|it works|working now|solved|works now)\b/,
];

const gratitudePatterns = [
  /\b(?:cam on|thank you|thanks)\b/,
];

const continuationPatterns = [
  /\b(?:buoc tiep theo|lam the nao|lam cai nay nhu nao|how do i|what next|next step|can you explain|help me|van con|van vuong|chua duoc|still need|still stuck|but|nhung)\b/,
];

/** Classifies feedback about the latest support answer, not the original ticket. */
export function classifyPostAnswerFeedback(text: string): FeedbackSentiment {
  const normalized = normalize(text);
  if (negativePatterns.some((pattern) => pattern.test(normalized)))
    return "negative";
  if (resolvedPatterns.some((pattern) => pattern.test(normalized)))
    return "positive";
  if (
    gratitudePatterns.some((pattern) => pattern.test(normalized)) &&
    !continuationPatterns.some((pattern) => pattern.test(normalized))
  )
    return "positive";
  return "neutral";
}

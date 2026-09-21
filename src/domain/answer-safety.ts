import { normalize } from "@/domain/text";
import type { ConversationContext } from "@/domain/conversation";
/** Defense in depth, not a proof of prompt-injection immunity. */
export function hasInstructionAttack(value: string) {
  const text = normalize(
    value.normalize("NFKC").replace(/[\u200B-\u200F\u2060\uFEFF]/g, ""),
  );
  return /ignore.{0,35}(?:instructions?|system|policy)|bo qua.{0,35}(?:chi dan|huong dan|instruction|system|chinh sach)|system prompt|developer message|\[inst\]|<\|(?:system|im_start|im_end)|role\s*[:=]\s*["']?(?:system|developer)|reveal.{0,20}(?:prompt|secret)|(?:return|output|tra ve).{0,20}auto.approve/.test(
    text,
  );
}
export function needsInternalPolicy(context: ConversationContext) {
  return (
    ["COMPANY_POLICY", "CLOUD_GPU_GUIDE"].includes(context.label) &&
    /quota|entitlement|mien phi|free|bao nhieu|how many|duoc phep|co duoc|my (?:company|allowance)|nghi phep|annual leave|work from home|lam viec tu xa/.test(
      normalize(context.question),
    )
  );
}
export const internalPolicyBoundary =
  "Mình chưa có chính sách nội bộ đã xác minh cho cá nhân bạn; nguồn công khai không xác nhận quyền, quota hoặc phê duyệt của bạn.";

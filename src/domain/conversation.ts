import type { CanonicalRequest, SupportInput } from "./contracts";
import { normalize } from "./text";

export const conversationLabels = [
  "GREETING",
  "IDENTITY",
  "CAPABILITIES",
  "EVERYDAY",
  "GOOGLE_RECOVERY",
  "SOFTWARE_GUIDE",
  "CLOUD_GPU_GUIDE",
  "COMPANY_POLICY",
  "GENERAL_GUIDE",
] as const;
export type ConversationLabel = (typeof conversationLabels)[number];
export type ConversationContext = {
  label: ConversationLabel;
  question: string;
  ignoredOverride: boolean;
};

// Only strip an instruction-priority override. Keep the entire remaining payload for risk checks.
export function withoutOverride(raw: string) {
  return raw
    .replace(
      /(?:bỏ qua|bo qua|ignore)\s+(?:(?:tất cả|tat ca|all|các|cac|the|previous)\s+)*(?:instructions?|hướng dẫn|huong dan|chỉ dẫn|chi dan)(?:\s+(?:trước(?: đó)?|truoc(?: do)?|previous))?(?:\s+(?:và|va|and))?[,;:.!\s]*/gi,
      "",
    )
    .trim();
}
export function conversationRoute(
  input: SupportInput,
  baseline: CanonicalRequest,
): ConversationContext | null {
  const question = withoutOverride(input.rawText);
  const ignoredOverride = question !== input.rawText.trim();
  const risks = [
    ...baseline.riskSignals,
    ...baseline.subrequests.flatMap((part) => part.riskSignals),
  ];
  if (risks.some((risk) => risk !== "INJECTION" || !ignoredOverride))
    return null;
  if (baseline.redactions.length || !question) return null;
  const text = normalize(question);
  // A leftover override is not a harmless prefix, and guidance cannot smuggle a second action.
  if (
    /system prompt|developer message|auto.approve|ignore.*instruction|bo qua.*(?:instruction|huong dan)|bypass|bo qua.*(?:phe duyet|chinh sach)/.test(
      text,
    )
  )
    return null;
  if (
    /\b(?:cap|grant|provision|create|tao|mo|open|deploy|xoa|delete|doi|change)\b.{0,30}\b(?:quyen|access|vm|server|tai nguyen|resource|port|cong|database|db|firewall|role|production|pipeline)\b/.test(
      text,
    )
  )
    return null;
  if (
    Object.entries(input.fields).some(
      ([key, value]) =>
        value &&
        !(
          key === "intentLabel" &&
          /GUIDANCE|GENERAL_HOW_TO|COMPLIANCE_QUESTION|LOOKUP/.test(value)
        ),
    )
  )
    return null;
  if (input.requestKind && !["GUIDANCE", "OTHER"].includes(input.requestKind))
    return null;
  const how =
    /lam sao|lam the nao|cach |huong dan|su dung|how (?:to|do|can)|explain|what is/.test(
      text,
    );
  let label: ConversationLabel | undefined;
  if (
    /\b(?:google|gmail)\b/.test(text) &&
    /khoi phuc|lay lai|recover|quen|forgot|dang nhap|login/.test(text)
  )
    label = "GOOGLE_RECOVERY";
  else if (how && /\bgpu\b|cloud/.test(text)) label = "CLOUD_GPU_GUIDE";
  else if (
    /chinh sach|noi quy|quy dinh|company policy|employee policy/.test(text)
  )
    label = "COMPANY_POLICY";
  else if (
    how &&
    /tai |cai |download|install|phan mem|chuong trinh|software|ung dung/.test(
      text,
    )
  )
    label = "SOFTWARE_GUIDE";
  else if (
    /ban.*(?:xu ly|ho tro|lam duoc|giup).*gi|what can you|capabilities/.test(
      text,
    )
  )
    label = "CAPABILITIES";
  else if (/ban ten|ban la ai|your name|who are you/.test(text))
    label = "IDENTITY";
  else if (
    /an gi|an mon|mon an|bua (?:trua|toi)|cong thuc|banh kem|recipe|what.*eat|dinner|lunch/.test(
      text,
    )
  )
    label = "EVERYDAY";
  else if (
    /^(?:xin chao|chao(?: ban)?|hello|hi|hey|good morning)[!.? ]*$/.test(text)
  )
    label = "GREETING";
  else if (
    baseline.intentLabel === "UNKNOWN_SUPPORT_REQUEST" &&
    (how || /[?？]$/.test(text))
  )
    label = "GENERAL_GUIDE";
  if (!label) return null;
  // A specific operational request cannot enter chat merely by mentioning food or greetings.
  if (
    [
      "EVERYDAY",
      "IDENTITY",
      "CAPABILITIES",
      "GREETING",
      "GENERAL_GUIDE",
    ].includes(label) &&
    baseline.intentLabel !== "UNKNOWN_SUPPORT_REQUEST"
  )
    return null;
  return { label, question, ignoredOverride };
}
export function conversationalCanonical(
  baseline: CanonicalRequest,
  conversation: ConversationContext,
): CanonicalRequest {
  return {
    ...baseline,
    conversation,
    requestKind: "GUIDANCE",
    serviceGroup: "OTHER",
    intentLabel: `CHAT_${conversation.label}`,
    requestedAction: "answer",
    missingFields: [],
    riskSignals: [],
    subrequests: [],
    model: { source: "deterministic" },
  };
}

import { questionFor } from "./questions";
import type { CanonicalRequest, Decision } from "./contracts";
import {
  bucketPriority,
  demoResourceLimits,
  guidanceRules,
  POLICY_VERSION,
  riskRules,
} from "./policy-source";
import { normalize, teamFor } from "./text";

// Verified approval is supplied by a server-only verifier, never by input fields or model output.
export type Approval = {
  status: "not_required" | "pending" | "verified" | "invalid";
  reason?: string;
};
export function missingFacts(request: CanonicalRequest): string[] {
  const { entities: e, serviceGroup, requestKind } = request;
  if (request.intentLabel === "DEVICE_RESET_GUIDANCE") return ["resetType"];
  const guide = guidanceRules.find((rule) =>
    rule.labels.some((label) => label === request.intentLabel),
  );
  if (
    guide &&
    ["GUIDANCE", "SAFE_DIAGNOSTIC"].includes(requestKind) &&
    !["repair", "replace", "execute", "change", "deploy"].includes(
      request.requestedAction,
    )
  )
    return [];
  let required: string[];
  switch (serviceGroup) {
    case "DATABASE":
      required = [
        "system",
        "resourceScope",
        "environment",
        "permission",
        "duration",
        "reason",
      ];
      break;
    case "ACCOUNT_ACCESS":
      required = [
        "targetSystem",
        "environment",
        "accessType",
        "duration",
        "reason",
      ];
      break;
    case "GIT_PERMISSION":
      required = [
        "repository",
        "environment",
        "permission",
        "duration",
        "reason",
      ];
      break;
    case "CLOUD_GPU":
      required = [
        "provider",
        "environment",
        "duration",
        "purpose",
        ...(/GPU/.test(request.intentLabel)
          ? ["gpuType", "quantity"]
          : ["cpu", "ram", "disk"]),
      ];
      break;
    case "DEVICE_BOOT":
      required = ["deviceId", "location", "symptom", "requestedAction"];
      break;
    case "NETWORK_VPN":
      required = [
        "source",
        "target",
        "environment",
        "symptom",
        "requestedAction",
      ];
      break;
    case "KUBERNETES":
      required = [
        "cluster",
        "namespace",
        "workload",
        "environment",
        "requestedAction",
      ];
      break;
    case "CI_CD":
      required = ["repository", "pipeline", "environment", "requestedAction"];
      break;
    case "MONITORING":
      required = ["service", "symptom", "startTime", "requestedAction"];
      break;
    case "SOFTWARE_LICENSE":
      required = [
        "software",
        "version",
        "os",
        "approvedCatalogStatus",
        "businessPurpose",
        "licenseDuration",
      ];
      break;
    case "STORAGE":
      required = [
        "pathOrBucket",
        "operation",
        "dataSensitivity",
        "destination",
      ];
      break;
    default:
      required = ["targetServiceOrDevice", "desiredOutcome"];
  }
  // Only ask facts that can change this intent's decision; never demand access fields for diagnosis.
  const intent = request.intentLabel;
  if (/DATABASE_(CONNECTION|QUERY_ERROR|PERFORMANCE)/.test(intent))
    required = ["system", "environment", "symptom"];
  else if (
    /DATABASE_(BACKUP|RESTORE|EXPORT|IMPORT|MIGRATION|SCHEMA_CHANGE|DATA_CORRECTION)/.test(
      intent,
    )
  )
    required = [
      "system",
      "resourceScope",
      "environment",
      "operation",
      "dataSensitivity",
      ...(/EXPORT|BACKUP/.test(intent) ? ["destination"] : ["rollbackPlan"]),
    ];
  else if (/PIPELINE_(FAILED|VIEW_LOGS|RERUN)/.test(intent))
    required = ["repository", "pipeline", "environment"];
  else if (/K8S_VIEW_(LOGS|METRICS)/.test(intent))
    required = ["cluster", "namespace", "workload", "environment"];
  else if (/MONITORING_VIEW/.test(intent))
    required = ["service", "environment"];
  else if (
    /PORT_OPEN_REQUEST|FIREWALL_CHANGE|REMOTE_ACCESS|PUBLIC_EXPOSURE/.test(
      intent,
    )
  )
    required = ["source", "target", "port", "protocol", "environment"];
  else if (/SOFTWARE_(CRASH|PERFORMANCE|COMPATIBILITY)/.test(intent))
    required = ["software", "os", "symptom"];
  else if (/LICENSE_/.test(intent))
    required = ["software", "licenseDuration", "businessPurpose"];
  else if (/BACKUP_REQUEST|BACKUP_FAILURE/.test(intent))
    required = ["pathOrBucket", "dataSensitivity", "destination"];
  else if (/RESTORE_REQUEST|DATA_RECOVERY/.test(intent))
    required = ["pathOrBucket", "dataSensitivity", "desiredOutcome"];
  else if (/STORAGE_ACCESS|BUCKET_ACCESS/.test(intent))
    required = ["pathOrBucket", "permission", "duration", "reason"];
  else if (requestKind === "INCIDENT")
    required = ["symptom", "affectedScope", "startTime"];
  return required.filter(
    (field) =>
      !e[field]?.trim() ||
      /^(unknown|chua biet|bat ky|default|gap|any|not provided)$/i.test(
        normalize(e[field]),
      ),
  );
}

export function requiresApproval(request: CanonicalRequest) {
  return (
    request.requestKind === "ACCESS_REQUEST" ||
    request.riskSignals.some((signal) =>
      ["PRIVILEGED", "PRODUCTION_CHANGE"].includes(signal),
    ) ||
    /ACCESS|PERMISSION|MEMBERSHIP|ROLE_CHANGE/.test(request.intentLabel) ||
    ["CLOUD_GPU", "GIT_PERMISSION"].includes(request.serviceGroup) ||
    (request.serviceGroup === "SOFTWARE_LICENSE" &&
      request.requestKind !== "GUIDANCE" &&
      request.requestKind !== "SAFE_DIAGNOSTIC")
  );
}

export function evaluatePolicy(
  request: CanonicalRequest,
  approval: Approval = { status: "pending" },
): Decision {
  const missing = missingFacts(request);
  if (requiresApproval(request) && approval.status !== "verified")
    missing.push("verifiedApproval");
  const matched = riskRules.filter((rule) =>
    request.riskSignals.includes(rule.signal),
  );
  const base: Decision = {
    action: "NEEDS_INFORMATION",
    requestKind: request.requestKind,
    handlingMode: "GUIDE",
    riskLevel: "UNKNOWN",
    bucket: "MISSING_INFO",
    uncertaintyClass: "MISSING_FACTS",
    ruleIds: [],
    safeEvidence: request.evidence.map((item) => item.quote),
    missingFields: missing,
    questions: [],
    userReason: "",
    adminReason: "",
    nextStep: "Bổ sung các thông tin bên dưới.",
    assignedTeam: teamFor(request.serviceGroup),
    policyVersion: POLICY_VERSION,
  };
  if (matched.length) {
    const bucket = matched.reduce(
      (current, rule) =>
        bucketPriority[rule.bucket] > bucketPriority[current]
          ? rule.bucket
          : current,
      "BEYOND_AUTHORITY" as "SECURITY_RISK" | "BEYOND_AUTHORITY",
    );
    return {
      ...base,
      action: "ESCALATE",
      handlingMode: "HUMAN_REVIEW",
      riskLevel: matched.some(
        (rule) => !rule.id.startsWith("FAIL") && rule.signal !== "USER_HANDOFF",
      )
        ? "HIGH"
        : request.riskSignals.includes("USER_HANDOFF")
          ? "MEDIUM"
          : "UNKNOWN",
      bucket,
      uncertaintyClass:
        bucket === "SECURITY_RISK" ? "OUT_OF_POLICY" : "AUTHORITY_REQUIRED",
      ruleIds: [...new Set(matched.map((rule) => rule.id))],
      userReason: matched.find((rule) => rule.bucket === bucket)!.reason,
      adminReason: matched
        .map((rule) => `${rule.id}: ${rule.reason}`)
        .join(" "),
      assignedTeam:
        bucket === "SECURITY_RISK"
          ? request.riskSignals.includes("PUBLIC_EXPOSURE")
            ? "Security / Network"
            : "Security"
          : base.assignedTeam,
      nextStep:
        "Reviewer kiểm tra evidence và phạm vi; hệ thống không thực hiện thay đổi thật.",
      questions: [],
      reviewerQuestions: request.riskSignals.includes("PUBLIC_EXPOSURE")
        ? [
            "Nguồn, đích và cổng nào cần kết nối? Có thể dùng VPN hoặc giới hạn địa chỉ nguồn không?",
            "Ai chịu trách nhiệm phê duyệt và đóng kết nối sau thời hạn?",
          ]
        : request.riskSignals.includes("SECRET")
          ? [
              "Thông tin bí mật đã lộ cần được thu hồi ở hệ thống nào? Không yêu cầu người dùng gửi lại giá trị.",
            ]
          : request.riskSignals.includes("PRIVILEGED") ||
              request.riskSignals.includes("PRODUCTION_CHANGE")
            ? [
                "Ai có thẩm quyền duyệt hệ thống này? Quyền tối thiểu và thời hạn nào đáp ứng công việc?",
                "Mã phê duyệt, phạm vi tài nguyên và kế hoạch khôi phục đã được xác minh chưa?",
              ]
            : [
                "Xác nhận phạm vi và người có thẩm quyền xử lý.",
                ...missing.slice(0, 2).map((field) => questionFor(field)),
              ],
    };
  }
  if (approval.status === "invalid" && requiresApproval(request))
    return {
      ...base,
      action: "ESCALATE",
      handlingMode: "HUMAN_REVIEW",
      bucket: "BEYOND_AUTHORITY",
      uncertaintyClass: "AUTHORITY_REQUIRED",
      ruleIds: ["AUTH-007"],
      userReason: "Approval không đúng phạm vi, quyền hoặc thời hạn.",
      adminReason: approval.reason ?? "Approval verification failed",
      nextStep: "Reviewer yêu cầu approval đúng scope.",
    };

  const guide = guidanceRules.find((rule) =>
    rule.labels.some((label) => label === request.intentLabel),
  );
  if (missing.length || request.intentLabel === "UNKNOWN_SUPPORT_REQUEST") {
    const questions = [...new Set(missing)].slice(0, 3).map(questionFor);
    return {
      ...base,
      missingFields: [...new Set(missing)],
      questions,
      ruleIds: [
        request.intentLabel === "DEVICE_RESET_GUIDANCE"
          ? "INFO-RESET"
          : "INFO-001",
        ...(missing.includes("verifiedApproval") ? ["INFO-005"] : []),
      ],
      userReason:
        request.intentLabel === "DEVICE_RESET_GUIDANCE"
          ? questions[0]
          : "Cần thêm dữ kiện liên quan để hỗ trợ đúng; chưa có dấu hiệu phải chuyển Security.",
      adminReason: `Thiếu: ${missing.join(", ")}. Không suy diễn scope/approval.`,
    };
  }
  if (guide && ["GUIDANCE", "SAFE_DIAGNOSTIC"].includes(request.requestKind)) {
    const medium = ["vpn", "wifi", "software", "account"].includes(guide.topic);
    return {
      ...base,
      action: "AUTO_APPROVE",
      handlingMode: medium ? "LLM_ASSIST" : "GUIDE",
      riskLevel: medium ? "MEDIUM" : "LOW",
      bucket: "ROUTINE",
      uncertaintyClass: "NONE",
      ruleIds: [guide.id],
      missingFields: [],
      questions: [],
      userReason: "Có thể hướng dẫn các bước an toàn để bạn tự thực hiện.",
      adminReason: `${guide.id}: guidance-only; không cấp quyền, xóa dữ liệu hoặc thực thi tool.`,
      nextStep:
        "Làm theo hướng dẫn; có thể nhờ nhân viên hỗ trợ bất cứ lúc nào.",
    };
  }
  if (
    request.serviceGroup === "CLOUD_GPU" &&
    (!Number.isFinite(Number(request.entities.duration?.match(/\d+/)?.[0])) ||
      !/^(\d+)\s*(hours?|hrs?|h|gio|tieng)$/i.test(
        normalize(request.entities.duration ?? ""),
      ) ||
      Number(request.entities.duration?.match(/\d+/)?.[0]) >
        demoResourceLimits.hours ||
      (/GPU/.test(request.intentLabel) &&
        (!/^\d+$/.test(request.entities.quantity ?? "") ||
          Number(request.entities.quantity) < 1 ||
          Number(request.entities.quantity) > demoResourceLimits.gpuCount ||
          !(demoResourceLimits.gpuTypes as readonly string[]).includes(
            (request.entities.gpuType ?? "").toLowerCase(),
          ))) ||
      ["cpu", "ram", "disk"].some(
        (field, index) =>
          request.entities[field] &&
          (!Number.isFinite(Number(request.entities[field])) ||
            Number(request.entities[field]) <= 0 ||
            Number(request.entities[field]) >
              [
                demoResourceLimits.cpu,
                demoResourceLimits.ram,
                demoResourceLimits.disk,
              ][index]),
      ))
  )
    return {
      ...base,
      action: "ESCALATE",
      handlingMode: "HUMAN_REVIEW",
      bucket: "BEYOND_AUTHORITY",
      uncertaintyClass: "AUTHORITY_REQUIRED",
      riskLevel: "MEDIUM",
      ruleIds: ["AUTH-QUOTA"],
      userReason:
        "Tài nguyên vượt giới hạn mô phỏng hoặc chưa xác định được quy mô an toàn.",
      adminReason:
        "Demo quota: tối đa 2 GPU T4/A10, 4 CPU, 16 GB RAM, 100 GB disk, 8 giờ; cần người phụ trách xác nhận phần vượt giới hạn.",
      nextStep: "Nhân viên kiểm tra chi phí và khả năng cấp tài nguyên.",
    };
  const allowed =
    request.environment !== "production" &&
    request.environment !== "unknown" &&
    ((request.serviceGroup === "DATABASE" &&
      ["read", "read-only"].includes(request.entities.permission)) ||
      (request.serviceGroup === "ACCOUNT_ACCESS" &&
        ["read-only", "standard", "read"].includes(
          request.entities.accessType,
        )) ||
      (request.serviceGroup === "GIT_PERMISSION" &&
        ["read", "read-only", "write"].includes(request.entities.permission)) ||
      (request.serviceGroup === "CLOUD_GPU" &&
        ["sandbox", "development"].includes(request.environment)) ||
      (["CI_CD", "KUBERNETES", "MONITORING"].includes(request.serviceGroup) &&
        ["view_logs", "diagnose", "rerun"].includes(request.requestedAction)));
  if (
    allowed ||
    (request.serviceGroup === "DEVICE_BOOT" &&
      request.requestedAction === "repair")
  )
    return {
      ...base,
      action: "AUTO_APPROVE",
      handlingMode: "SIMULATED_WORKFLOW",
      riskLevel: "LOW",
      bucket: "ROUTINE",
      uncertaintyClass: "NONE",
      ruleIds: ["ROUTINE-001"],
      missingFields: [],
      questions: [],
      userReason:
        "Đủ điều kiện tạo workflow mô phỏng trong phạm vi đã xác minh.",
      adminReason:
        "Scope không production, quyền tối thiểu, đủ dữ kiện và approval cần thiết.",
      nextStep:
        "Đã mô phỏng tiếp nhận; chưa có thao tác hạ tầng hay cấp quyền thật.",
    };
  return {
    ...base,
    action: "ESCALATE",
    handlingMode: "HUMAN_REVIEW",
    bucket: "BEYOND_AUTHORITY",
    uncertaintyClass: "OUT_OF_POLICY",
    ruleIds: ["AUTH-005"],
    userReason: "Phạm vi này chưa có rule tự xử lý an toàn.",
    adminReason:
      "Không có safe execution path; reviewer xác định authority và integration.",
    nextStep: "Chuyển team phụ trách xác nhận.",
  };
}

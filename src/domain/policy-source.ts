import type { RiskSignal } from "./contracts";

// Versioned executable policy data. Meaning and migrations are documented independently of the engine.
export const POLICY_VERSION = "support-guidance-v3";
export const bucketPriority = {
  ROUTINE: 0,
  MISSING_INFO: 1,
  BEYOND_AUTHORITY: 2,
  SECURITY_RISK: 3,
} as const;
export const riskRules: Array<{
  signal: RiskSignal;
  id: string;
  bucket: "SECURITY_RISK" | "BEYOND_AUTHORITY";
  reason: string;
}> = [
  {
    signal: "SECRET",
    id: "SEC-001",
    bucket: "SECURITY_RISK",
    reason:
      "Yêu cầu chứa hoặc xin thông tin xác thực; chỉ giữ bằng chứng đã che.",
  },
  {
    signal: "PUBLIC_EXPOSURE",
    id: "SEC-002",
    bucket: "SECURITY_RISK",
    reason: "Mở truy cập từ Internet cần Security và Network xem xét.",
  },
  {
    signal: "SECURITY_CONTROL",
    id: "SEC-002",
    bucket: "SECURITY_RISK",
    reason: "Không tự tắt MFA, EDR, audit hoặc kiểm soát bảo mật.",
  },
  {
    signal: "BYPASS",
    id: "SEC-003",
    bucket: "SECURITY_RISK",
    reason: "Không bỏ qua quy trình phê duyệt hoặc change control.",
  },
  {
    signal: "INJECTION",
    id: "SEC-004",
    bucket: "SECURITY_RISK",
    reason: "Chỉ dẫn trong ticket không có quyền thay đổi policy.",
  },
  {
    signal: "DATA_EXPORT",
    id: "SEC-005",
    bucket: "SECURITY_RISK",
    reason: "Xuất dữ liệu tới đích chưa kiểm soát cần Security và Data owner.",
  },
  {
    signal: "UNAPPROVED_SOFTWARE",
    id: "SEC-006",
    bucket: "SECURITY_RISK",
    reason: "Phần mềm chưa được duyệt cần kiểm tra an toàn.",
  },
  {
    signal: "PRIVILEGED",
    id: "AUTH-003",
    bucket: "BEYOND_AUTHORITY",
    reason: "Quyền đặc quyền cần reviewer và owner có thẩm quyền.",
  },
  {
    signal: "PRODUCTION_CHANGE",
    id: "AUTH-002",
    bucket: "BEYOND_AUTHORITY",
    reason: "Truy cập dữ liệu hoặc thay đổi production cần reviewer.",
  },
  {
    signal: "CONTROL_CHANGE",
    id: "AUTH-004",
    bucket: "BEYOND_AUTHORITY",
    reason: "Thay đổi cấu hình, quota hoặc control cần owner xác nhận.",
  },
  {
    signal: "CONFLICT",
    id: "AUTH-006",
    bucket: "BEYOND_AUTHORITY",
    reason: "Các dữ kiện mâu thuẫn; giữ cả hai để reviewer xác nhận.",
  },
  {
    signal: "DESTRUCTIVE",
    id: "AUTH-008",
    bucket: "BEYOND_AUTHORITY",
    reason: "Thao tác xóa dữ liệu, wipe hoặc thay thiết bị cần admin.",
  },
  {
    signal: "INCIDENT",
    id: "AUTH-009",
    bucket: "BEYOND_AUTHORITY",
    reason: "Incident cần chuyên viên xác định tác động và phương án xử lý.",
  },
  {
    signal: "USER_HANDOFF",
    id: "HANDOFF-001",
    bucket: "BEYOND_AUTHORITY",
    reason:
      "Bạn muốn người phụ trách hỗ trợ trực tiếp; lịch sử được giữ cho admin.",
  },
  {
    signal: "MODEL_UNAVAILABLE",
    id: "FAIL-001",
    bucket: "BEYOND_AUTHORITY",
    reason:
      "Model chưa sẵn sàng hoặc không trả lời đúng hạn; chuyển người xử lý.",
  },
  {
    signal: "MODEL_OUTPUT_INVALID",
    id: "FAIL-002",
    bucket: "BEYOND_AUTHORITY",
    reason:
      "Model trả dữ liệu không đúng schema hoặc hướng dẫn ngoài phạm vi an toàn.",
  },
  {
    signal: "MODEL_EVIDENCE_INVALID",
    id: "FAIL-003",
    bucket: "BEYOND_AUTHORITY",
    reason: "Không xác minh được bằng chứng hoặc phạm vi do model trích xuất.",
  },
];

export const guidanceRules = [
  {
    id: "GUIDE-001",
    labels: ["DEVICE_SHUTDOWN_GUIDANCE", "DEVICE_RESTART_GUIDANCE"],
    topic: "restart",
  },
  {
    id: "GUIDE-002",
    labels: [
      "DEVICE_FREEZE",
      "DEVICE_WONT_BOOT",
      "DEVICE_SLOW",
      "DEVICE_CRASH",
      "DEVICE_BATTERY",
    ],
    topic: "device",
  },
  {
    id: "GUIDE-003",
    labels: ["VPN_SETUP", "VPN_LOGIN", "VPN_NOT_CONNECTING"],
    topic: "vpn",
  },
  {
    id: "GUIDE-004",
    labels: [
      "WIFI_NOT_WORKING",
      "NETWORK_UNREACHABLE",
      "DNS_RESOLUTION",
      "BANDWIDTH_ISSUE",
      "CERTIFICATE_ERROR",
    ],
    topic: "wifi",
  },
  {
    id: "GUIDE-005",
    labels: [
      "APPROVED_CATALOG_LOOKUP",
      "SOFTWARE_CRASH",
      "SOFTWARE_COMPATIBILITY",
      "SOFTWARE_PERFORMANCE",
      "LICENSE_ACTIVATION",
    ],
    topic: "software",
  },
  {
    id: "GUIDE-006",
    labels: [
      "ACCOUNT_LOGIN",
      "ACCOUNT_LOCKED",
      "PASSWORD_RESET",
      "MFA_SETUP",
      "MFA_FAILURE",
      "SSO_FAILURE",
    ],
    topic: "account",
  },
  {
    id: "GUIDE-007",
    labels: [
      "DEVICE_PRINTER",
      "DEVICE_DISPLAY",
      "DEVICE_AUDIO",
      "DEVICE_CAMERA",
    ],
    topic: "peripherals",
  },
  {
    id: "GUIDE-008",
    labels: [
      "GENERAL_HOW_TO",
      "DATABASE_QUERY_HELP",
      "GIT_HELP",
      "COMPLIANCE_QUESTION",
    ],
    topic: "general",
  },
] as const;
export type GuidanceTopic = (typeof guidanceRules)[number]["topic"];

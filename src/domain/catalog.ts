import type { ServiceGroup } from "./contracts";

type Service = {
  label: string;
  team: string;
  labels: string[];
  fields: string[];
};
const words = (text: string) => text.split(" ");
export const catalog: Record<ServiceGroup, Service> = {
  DEVICE_BOOT: {
    label: "Máy tính & thiết bị",
    team: "IT Helpdesk",
    labels: words(
      "DEVICE_SHUTDOWN_GUIDANCE DEVICE_RESTART_GUIDANCE DEVICE_RESET_GUIDANCE DEVICE_FACTORY_RESET DEVICE_WONT_BOOT DEVICE_FREEZE DEVICE_SLOW DEVICE_CRASH DEVICE_UPDATE_DRIVER DEVICE_BATTERY DEVICE_DISPLAY DEVICE_AUDIO DEVICE_CAMERA DEVICE_PRINTER DEVICE_LOST_STOLEN DEVICE_REPLACEMENT DEVICE_WIPE",
    ),
    fields: words(
      "deviceType ownership symptom requestedAction deviceId location urgency dataLossRisk backup",
    ),
  },
  ACCOUNT_ACCESS: {
    label: "Tài khoản & quyền truy cập",
    team: "IAM/IT",
    labels: words(
      "ACCOUNT_LOGIN ACCOUNT_LOCKED PASSWORD_RESET MFA_SETUP MFA_FAILURE SSO_FAILURE REQUEST_STANDARD_ACCESS REQUEST_READ_ACCESS REQUEST_WRITE_ACCESS REQUEST_ADMIN_ACCESS REQUEST_ROOT_ACCESS GROUP_MEMBERSHIP ROLE_CHANGE REVOKE_ACCESS SERVICE_ACCOUNT ACCOUNT_DEACTIVATION",
    ),
    fields: words(
      "targetSystem environment accessType duration reason approvalStatus approvalReference",
    ),
  },
  DATABASE: {
    label: "Database & dữ liệu",
    team: "DBA/Data",
    labels: words(
      "DATABASE_CONNECTION DATABASE_READ_ACCESS DATABASE_WRITE_ACCESS DATABASE_QUERY_HELP DATABASE_QUERY_ERROR DATABASE_PERFORMANCE DATABASE_PROVISION DATABASE_SCHEMA_CHANGE DATABASE_DATA_CORRECTION DATABASE_EXPORT DATABASE_IMPORT DATABASE_BACKUP DATABASE_RESTORE DATABASE_MIGRATION DATABASE_PRODUCTION_INCIDENT",
    ),
    fields: words(
      "databaseType system resourceScope environment operation permission dataSensitivity dataVolume destination duration rollbackPlan approvalReference reason",
    ),
  },
  NETWORK_VPN: {
    label: "Mạng, VPN & DNS",
    team: "Network",
    labels: words(
      "VPN_SETUP VPN_LOGIN VPN_NOT_CONNECTING WIFI_NOT_WORKING NETWORK_UNREACHABLE DNS_RESOLUTION DNS_CHANGE PROXY_CONFIG FIREWALL_DIAGNOSTIC FIREWALL_CHANGE PORT_OPEN_REQUEST PUBLIC_EXPOSURE REMOTE_ACCESS BANDWIDTH_ISSUE CERTIFICATE_ERROR",
    ),
    fields: words(
      "service source target environment protocol port publicExposure requestedAction affectedUsers symptom urgency",
    ),
  },
  SOFTWARE_LICENSE: {
    label: "Phần mềm & license",
    team: "IT",
    labels: words(
      "SOFTWARE_INSTALL SOFTWARE_UPDATE SOFTWARE_UNINSTALL SOFTWARE_CRASH SOFTWARE_COMPATIBILITY SOFTWARE_PERFORMANCE LICENSE_ACTIVATION LICENSE_REQUEST APPROVED_CATALOG_LOOKUP BROWSER_EXTENSION UNSIGNED_SOFTWARE UNAPPROVED_SOFTWARE DEVELOPER_TOOL_SETUP",
    ),
    fields: words(
      "software version os requestedAction approvedCatalogStatus installationSource licenseDuration licenseType businessPurpose approvalReference",
    ),
  },
  CLOUD_GPU: {
    label: "Cloud & GPU",
    team: "Cloud/ML Infra",
    labels: words(
      "CLOUD_SANDBOX CLOUD_VM_REQUEST GPU_REQUEST GPU_QUOTA GPU_CAPACITY CLOUD_STORAGE CLOUD_COST CLOUD_BUDGET PUBLIC_IP RESOURCE_SCALE RESOURCE_DELETE CLOUD_CREDENTIAL",
    ),
    fields: words(
      "provider resourceType gpuType quantity cpu ram disk environment duration publicIp purpose budgetOrQuota estimatedCost cleanupPlan approvalStatus approvalReference",
    ),
  },
  KUBERNETES: {
    label: "Kubernetes & Platform",
    team: "Platform",
    labels: words(
      "K8S_VIEW_LOGS K8S_VIEW_METRICS K8S_RESTART_POD K8S_SCALE_WORKLOAD K8S_NAMESPACE_REQUEST K8S_DEPLOY K8S_MANIFEST_CHANGE K8S_ROLLBACK K8S_EXEC_POD K8S_CLUSTER_ACCESS K8S_SECRET_ACCESS K8S_INGRESS_CHANGE K8S_CLUSTER_ADMIN",
    ),
    fields: words(
      "cluster namespace workload environment requestedAction privilegeLevel duration rollbackPlan secretAccess",
    ),
  },
  CI_CD: {
    label: "CI/CD & triển khai",
    team: "DevOps",
    labels: words(
      "PIPELINE_VIEW_LOGS PIPELINE_RERUN PIPELINE_FAILED PIPELINE_PERMISSION PIPELINE_CONFIG_CHANGE STAGING_DEPLOY PRODUCTION_DEPLOY PRODUCTION_ROLLBACK SECRET_UPDATE RELEASE_APPROVAL BYPASS_APPROVAL_GATE",
    ),
    fields: words(
      "repository pipeline environment requestedAction reason branchOrTag configChange secretChange rollbackPlan approvalReference",
    ),
  },
  MONITORING: {
    label: "Monitoring & incident",
    team: "SRE",
    labels: words(
      "MONITORING_VIEW_LOGS MONITORING_VIEW_METRICS ALERT_NOT_RECEIVED ALERT_FALSE_POSITIVE ALERT_THRESHOLD ALERT_ROUTING INCIDENT_REPORT INCIDENT_TRIAGE SERVICE_DEGRADED SERVICE_OUTAGE P1_INCIDENT P2_INCIDENT SLO_BREACH",
    ),
    fields: words(
      "service alertId symptom startTime timeWindow dashboardOrLogSource affectedScope severity requestedAction environment urgency",
    ),
  },
  STORAGE: {
    label: "Storage & backup",
    team: "Storage/Data",
    labels: words(
      "STORAGE_ACCESS STORAGE_QUOTA FILE_SHARE BUCKET_ACCESS BACKUP_REQUEST BACKUP_FAILURE RESTORE_REQUEST DATA_RECOVERY DATA_DELETE DATA_RETENTION DATA_EXPORT ARCHIVE_REQUEST",
    ),
    fields: words(
      "storageType pathOrBucket operation dataSensitivity destination retention productionData approvalReference",
    ),
  },
  SECURITY: {
    label: "Security & compliance",
    team: "Security",
    labels: words(
      "PHISHING_REPORT MALWARE_SUSPECTED SUSPICIOUS_LOGIN LOST_DEVICE_SECURITY SECRET_EXPOSURE CREDENTIAL_LEAK VULNERABILITY_REPORT POLICY_EXCEPTION MFA_DISABLE_REQUEST EDR_DISABLE_REQUEST SECURITY_INCIDENT DATA_BREACH AUDIT_EVIDENCE COMPLIANCE_QUESTION",
    ),
    fields: words(
      "asset assetOrService environment incidentType issue evidence detectedAt impact requestedAction urgency containmentRequested containsSecret containsCustomerData reporterContact approvalReference incidentId",
    ),
  },
  GIT_PERMISSION: {
    label: "Git & repository",
    team: "DevOps",
    labels: words("GIT_READ_ACCESS GIT_WRITE_ACCESS GIT_ADMIN_ACCESS GIT_HELP"),
    fields: words(
      "provider repository environment permission duration reason approvalReference",
    ),
  },
  OTHER: {
    label: "Khác / chưa rõ nhóm",
    team: "Classifier/reviewer",
    labels: words(
      "UNKNOWN_SUPPORT_REQUEST GENERAL_HOW_TO CROSS_FUNCTION_REQUEST UNCLASSIFIED_ACCESS UNCLASSIFIED_INCIDENT UNCLASSIFIED_CHANGE REQUEST_CLASSIFICATION_HELP",
    ),
    fields: words(
      "summary targetServiceOrDevice environmentIfKnown desiredOutcome reason urgency",
    ),
  },
};

export const commonFields = words(
  "impact environment urgency desiredOutcome approvalStatus dataSensitivity",
);
export const fieldOptions: Record<string, string[]> = {
  environment: ["unknown", "sandbox", "development", "staging", "production"],
  environmentIfKnown: [
    "unknown",
    "sandbox",
    "development",
    "staging",
    "production",
  ],
  deviceType: ["Laptop", "Desktop", "Monitor", "Printer", "Mobile", "Other"],
  ownership: ["Unknown", "Personal", "Corporate", "Shared"],
  requestedAction: [
    "guidance",
    "diagnose",
    "restart",
    "repair",
    "boot_assistance",
    "diagnosis",
    "hardware_check",
    "replace",
    "wipe",
    "view_logs",
    "view_metrics",
    "investigate",
    "rerun",
    "scale",
    "deploy",
    "change",
  ],
  accessType: ["read-only", "standard", "write", "admin", "root", "owner"],
  permission: [
    "read-only",
    "read",
    "triage",
    "write",
    "admin",
    "root",
    "owner",
    "maintain",
  ],
  privilegeLevel: ["read-only", "standard", "admin", "cluster-admin"],
  operation: [
    "read",
    "write",
    "provision",
    "query_help",
    "export",
    "import",
    "backup",
    "restore",
    "delete",
    "change",
  ],
  urgency: ["normal", "low", "high", "critical"],
  approvalStatus: ["not_provided", "claimed", "pending"],
  dataSensitivity: [
    "unknown",
    "synthetic",
    "internal",
    "customer",
    "confidential",
  ],
  dataLossRisk: ["Unknown", "No", "Yes"],
  backup: ["Unknown", "No", "Yes"],
  publicExposure: ["unknown", "no", "yes"],
  publicIp: ["unknown", "no", "yes"],
  secretAccess: ["unknown", "no", "yes"],
  containsSecret: ["unknown", "no", "yes"],
  containsCustomerData: ["unknown", "no", "yes"],
  productionData: ["unknown", "no", "yes"],
  configChange: ["unknown", "no", "yes"],
  secretChange: ["unknown", "no", "yes"],
  approvedCatalogStatus: ["unknown", "approved", "unapproved"],
  protocol: ["TCP", "UDP", "HTTPS", "SSH", "RDP", "Other"],
};
export const fieldLabels: Record<string, string> = {
  intentLabel: "Nhu cầu cụ thể",
  system: "Hệ thống",
  targetSystem: "Hệ thống đích",
  resourceScope: "Phạm vi tài nguyên",
  environment: "Môi trường",
  duration: "Thời hạn",
  approvalReference: "Mã phê duyệt (cần xác minh)",
  approvalStatus: "Thông tin phê duyệt",
  permission: "Quyền yêu cầu",
  deviceId: "Mã thiết bị",
  location: "Vị trí",
  requestedAction: "Thao tác mong muốn",
  ownership: "Thiết bị thuộc ai",
  symptom: "Triệu chứng",
  reason: "Lý do",
  resetType: "Restart hay factory reset?",
  service: "Dịch vụ bị ảnh hưởng",
  provider: "Nhà cung cấp/nền tảng",
  urgency: "Mức độ ảnh hưởng",
  port: "Port cụ thể",
  budgetOrQuota: "Quota/budget đã kiểm tra",
  businessPurpose: "Mục đích nghiệp vụ",
  licenseDuration: "Thời hạn license",
  licenseType: "Loại license",
  timeWindow: "Khoảng thời gian quan sát",
  dashboardOrLogSource: "Dashboard/log source/alert ID",
  reporterContact: "Đầu mối báo cáo",
  assetOrService: "Asset hoặc service bị ảnh hưởng",
  issue: "Vấn đề hoặc nghi vấn",
  summary: "Tóm tắt yêu cầu",
  targetServiceOrDevice: "Service, hệ thống hoặc thiết bị đích",
  environmentIfKnown: "Môi trường nếu biết",
};
export function labelForField(name: string) {
  return fieldLabels[name] ?? name.replace(/([A-Z])/g, " $1");
}
export const allFields = new Set([
  "intentLabel",
  ...commonFields,
  ...Object.values(catalog).flatMap((service) => service.fields),
]);
export function validIntent(group: ServiceGroup, intent: string) {
  return catalog[group].labels.includes(intent);
}

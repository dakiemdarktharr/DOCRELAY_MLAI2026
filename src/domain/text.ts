import { catalog, validIntent } from "./catalog";
import type {
  CanonicalRequest,
  Environment,
  Extraction,
  RequestKind,
  RiskSignal,
  ServiceGroup,
  SupportInput,
} from "./contracts";
import { redact } from "./redaction";

export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Negation is local to the matched phrase; it cannot cancel a later risky subrequest.
function asserted(text: string, pattern: RegExp) {
  const matcher = new RegExp(pattern.source, "g");
  for (const match of text.matchAll(matcher)) {
    const prefix = text.slice(
      Math.max(0, (match.index ?? 0) - 70),
      match.index,
    );
    if (
      !/(?:khong|not|no|without|never|don't|do not)(?:\s+(?:can|need|request|require|yeu cau|co|muon|quyen|access|vao|to|for|any|a|an|the|production|real|true|admin|hay|or)){0,5}\s*$/.test(
        prefix,
      )
    )
      return true;
  }
  return false;
}

export function detectedRisks(raw: string): RiskSignal[] {
  const text = normalize(raw);
  const risks = new Set<RiskSignal>();
  if (
    /chuyen.{0,20}admin|pass.{0,15}admin|human (?:agent|reviewer)|khong hieu.{0,30}(?:ho tro|giup)/.test(
      text,
    )
  )
    risks.add("USER_HANDOFF");
  const selfService =
    /(?:reset|quen|forgot|doi|change)\s+(?:my |own |mat khau|password)|password reset/.test(
      text,
    );
  if (
    /\[redacted/.test(text) ||
    asserted(
      text,
      /private key|kubeconfig|vault token|api key|credential|secret|bearer/,
    ) ||
    (!selfService && asserted(text, /password|mat khau|\btoken\b/)) ||
    /(?:send|share|give|gui|cho|cung cap).{0,35}(?:password|mat khau|token|secret)/.test(
      text,
    )
  )
    risks.add("SECRET");
  const exposure = asserted(
    text,
    /public|internet|0\.0\.0\.0\/0|0\/0|allow all|ra ngoai/,
  );
  if (
    exposure &&
    /\b(?:port|inbound|rdp|vnc|ssh|expose|exposed|exposure|accessible|access from|internet facing|open|mo|remote|public ip)\b/.test(
      text,
    )
  )
    risks.add("PUBLIC_EXPOSURE");
  if (
    asserted(
      text,
      /(?:(?:disable|turn off|stop|remove|deactivate|tat|dung|bo)\s+(?:the |agent |security )?(?:mfa|2fa|edr|audit(?: logging)?|logging|security control|approval prompt|password)|(?:turn|switch)\s+(?:the |agent |security )?(?:mfa|2fa|edr|audit(?: logging)?|logging|security control)\s+off)/,
    )
  )
    risks.add("SECURITY_CONTROL");
  if (
    asserted(
      text,
      /(?:bypass|skip|ignore|bo qua|khoi can|khong can qua)\s+(?:the |security |software |network )?(?:policy|review|approval|gate|control|quy trinh|chinh sach|form|cab)/,
    ) ||
    /(?:cu|lam|cap|mo).{0,20}truoc.{0,30}(?:approval|phe duyet).{0,15}sau/.test(
      text,
    )
  )
    risks.add("BYPASS");
  if (
    /ignore (?:all |previous |the )?(?:instructions|policy|security)|system prompt|developer message|return auto.approve|tra ve auto.approve|already approved by the system/.test(
      text,
    )
  )
    risks.add("INJECTION");
  if (
    asserted(text, /export|dump|copy|xuat|sao chep/) &&
    /production|prod\b|customer|khach hang/.test(text) &&
    /laptop|may (?:ca nhan|phan tich)|repo|public|unmanaged|drive|bucket|storage/.test(
      text,
    )
  )
    risks.add("DATA_EXPORT");
  if (
    asserted(
      text,
      /unsigned|sideload|unapproved|torrent|bittorrent|miner|xmrig|crack|disable edr/,
    )
  )
    risks.add("UNAPPROVED_SOFTWARE");
  if (
    asserted(
      text,
      /cluster admin|\broot\b|quyen full|quyen (?:production )?admin|production admin|admin access|admin permission|admin role|owner access|cloud admin|cap admin|grant admin|permission\s*[:=]?\s*admin|privilegelevel\s*[:=]?\s*admin/,
    )
  )
    risks.add("PRIVILEGED");
  if (
    asserted(text, /production|\bprod\b/) &&
    /write|ghi|update|sua|delete|xoa|drop|deploy|rollback|admin|root|read access|read only access|select access|cap.{0,12}quyen/.test(
      text,
    )
  )
    risks.add("PRODUCTION_CHANGE");
  if (
    asserted(
      text,
      /\bwipe\b|xoa (?:het|toan bo)|factory reset|khoi phuc cai dat goc|format disk|drop table|drop bang|data delete|delete resource/,
    )
  )
    risks.add("DESTRUCTIVE");
  if (
    asserted(
      text,
      /lost device|stolen|mat laptop|malware|phishing|data breach|suspicious login|service outage|\bp1\b|\bp2\b|bi tan cong/,
    )
  )
    risks.add("INCIDENT");
  if (
    asserted(
      text,
      /firewall change|dns change|proxy change|alert threshold|quota increase|tang quota|sua manifest|manifest change|config change|doi cau hinh/,
    )
  )
    risks.add("CONTROL_CHANGE");
  return [...risks];
}

function environmentOf(text: string): Environment {
  if (asserted(text, /production|\bprod\b/)) return "production";
  if (/\bstaging\b|\buat\b|\bqa\b/.test(text)) return "staging";
  if (/\bsandbox\b/.test(text)) return "sandbox";
  if (/\bdev\b|development/.test(text)) return "development";
  return "unknown";
}

function classify(text: string): [ServiceGroup, string, RequestKind] {
  if (
    /chuyen.{0,20}admin|pass.{0,15}admin|human (?:agent|reviewer)|khong hieu/.test(
      text,
    )
  )
    return ["OTHER", "REQUEST_CLASSIFICATION_HELP", "OTHER"];
  if (
    /vpn/.test(text) &&
    /loi|fail|not connect|khong ket noi|troubleshoot|setup|cai dat|dang nhap/.test(
      text,
    )
  )
    return ["NETWORK_VPN", "VPN_NOT_CONNECTING", "SAFE_DIAGNOSTIC"];
  if (/wifi|wi fi|mang khong|network unreachable/.test(text))
    return ["NETWORK_VPN", "WIFI_NOT_WORKING", "SAFE_DIAGNOSTIC"];
  if (asserted(text, /factory reset|khoi phuc cai dat goc/))
    return ["DEVICE_BOOT", "DEVICE_FACTORY_RESET", "CONFIGURATION_CHANGE"];
  if (asserted(text, /\bwipe\b|xoa toan bo (?:may|thiet bi)/))
    return ["DEVICE_BOOT", "DEVICE_WIPE", "CONFIGURATION_CHANGE"];
  if (/shutdown|shut down|tat may|power off/.test(text))
    return ["DEVICE_BOOT", "DEVICE_SHUTDOWN_GUIDANCE", "GUIDANCE"];
  if (
    /restart|reboot|khoi dong lai/.test(text) &&
    !/pod|cluster|server|service|workload/.test(text)
  )
    return ["DEVICE_BOOT", "DEVICE_RESTART_GUIDANCE", "GUIDANCE"];
  if (/reset/.test(text) && /may|computer|laptop|device/.test(text))
    return ["DEVICE_BOOT", "DEVICE_RESET_GUIDANCE", "GUIDANCE"];
  if (/freeze|frozen|bi treo|bi do|hangs|not responding/.test(text))
    return ["DEVICE_BOOT", "DEVICE_FREEZE", "SAFE_DIAGNOSTIC"];
  if (/won.t boot|won.t start|khong (?:bat|khoi dong)|boot loop/.test(text))
    return ["DEVICE_BOOT", "DEVICE_WONT_BOOT", "SAFE_DIAGNOSTIC"];
  if (/printer|may in/.test(text))
    return ["DEVICE_BOOT", "DEVICE_PRINTER", "SAFE_DIAGNOSTIC"];
  if (/\b(?:audio|am thanh|microphone|loa)\b/.test(text))
    return ["DEVICE_BOOT", "DEVICE_AUDIO", "SAFE_DIAGNOSTIC"];
  if (/\b(?:display|monitor|man hinh)\b/.test(text))
    return ["DEVICE_BOOT", "DEVICE_DISPLAY", "SAFE_DIAGNOSTIC"];
  if (
    /password reset|reset.{0,10}(?:password|mat khau)|quen mat khau|forgot.{0,10}password/.test(
      text,
    )
  )
    return ["ACCOUNT_ACCESS", "PASSWORD_RESET", "GUIDANCE"];
  if (
    /mfa|sso|account locked|login|dang nhap/.test(text) &&
    !/disable|tat |cap quyen/.test(text)
  )
    return ["ACCOUNT_ACCESS", "ACCOUNT_LOGIN", "SAFE_DIAGNOSTIC"];
  if (/phishing|malware|security incident|data breach/.test(text))
    return ["SECURITY", "SECURITY_INCIDENT", "INCIDENT"];
  if (/port|firewall|rdp|dns|public ip|vpn|proxy/.test(text))
    return ["NETWORK_VPN", "PORT_OPEN_REQUEST", "CONFIGURATION_CHANGE"];
  if (/github|gitlab|\bgit\b|repository|\brepo\b/.test(text))
    return ["GIT_PERMISSION", "GIT_READ_ACCESS", "ACCESS_REQUEST"];
  if (
    /database|\bdb\b|mysql|postgres|redis|mongodb|clickhouse|sql/.test(text)
  ) {
    if (
      /query help|cach viet.{0,15}(?:query|sql)|how to write.{0,15}query/.test(
        text,
      )
    )
      return ["DATABASE", "DATABASE_QUERY_HELP", "GUIDANCE"];
    if (/\b(?:export|dump|copy data|xuat du lieu|sao chep du lieu)\b/.test(text))
      return ["DATABASE", "DATABASE_EXPORT", "CONFIGURATION_CHANGE"];
    return [
      "DATABASE",
      /write|ghi|update|ddl/.test(text)
        ? "DATABASE_WRITE_ACCESS"
        : "DATABASE_READ_ACCESS",
      "ACCESS_REQUEST",
    ];
  }
  if (
    /gpu|a100|h100|t4|sandbox|vcpu|etl|airflow|server|cloud|\bvm\b/.test(text)
  )
    return [
      "CLOUD_GPU",
      /gpu|a100|h100|t4/.test(text) ? "GPU_REQUEST" : "CLOUD_SANDBOX",
      "ROUTINE_WORKFLOW",
    ];
  if (/kubernetes|\bk8s\b|kubectl|namespace|\bpod\b/.test(text))
    return ["KUBERNETES", "K8S_VIEW_LOGS", "ROUTINE_WORKFLOW"];
  if (/pipeline|ci\/cd|deployment/.test(text))
    return ["CI_CD", "PIPELINE_FAILED", "SAFE_DIAGNOSTIC"];
  if (/monitoring|metrics|grafana|alert/.test(text))
    return ["MONITORING", "MONITORING_VIEW_LOGS", "SAFE_DIAGNOSTIC"];
  if (/software|phan mem|license|ung dung|application/.test(text))
    return [
      "SOFTWARE_LICENSE",
      /cach|how|use|su dung/.test(text)
        ? "APPROVED_CATALOG_LOOKUP"
        : "SOFTWARE_INSTALL",
      /cach|how|use|su dung/.test(text) ? "GUIDANCE" : "ROUTINE_WORKFLOW",
    ];
  if (/backup|restore|storage|bucket|file share/.test(text))
    return ["STORAGE", "BACKUP_REQUEST", "ROUTINE_WORKFLOW"];
  if (/access|quyen|permission|admin|jira|confluence/.test(text))
    return ["ACCOUNT_ACCESS", "REQUEST_STANDARD_ACCESS", "ACCESS_REQUEST"];
  if (/how to|lam sao|huong dan|cach su dung/.test(text))
    return ["OTHER", "GENERAL_HOW_TO", "GUIDANCE"];
  return ["OTHER", "UNKNOWN_SUPPORT_REQUEST", "OTHER"];
}

export function extractText(rawText: string): Extraction {
  const text = normalize(rawText);
  const [serviceGroup, intentLabel, requestKind] = classify(text);
  const riskSignals = detectedRisks(rawText);
  const entities: Record<string, string> = {};
  const system = text.match(
    /\b(mysql|postgresql|postgres|redis|mongodb|clickhouse|jira|confluence|github|gitlab)\b/,
  );
  if (system) entities.system = system[1];
  const permission = asserted(text, /\badmin\b|\broot\b|\bowner\b/)
    ? text.match(/\b(admin|root|owner)\b/)?.[1]
    : /read.only|\bread\b|\bselect\b/.test(text)
      ? "read-only"
      : /write|quyen ghi/.test(text)
        ? "write"
        : undefined;
  if (
    permission &&
    (requestKind === "ACCESS_REQUEST" || riskSignals.includes("PRIVILEGED"))
  )
    entities.permission = permission;
  const duration = text.match(
    /\b\d+\s*(?:hours?|hrs?|h\b|days?|ngay|gio|tieng|phut|minutes?)/,
  );
  if (duration) entities.duration = duration[0];
  const environment = environmentOf(text);
  if (environment !== "unknown") entities.environment = environment;
  const approvalReference = rawText.match(/\b[A-Z][A-Z0-9]{1,12}-\d{2,10}\b/);
  if (approvalReference) entities.approvalReference = approvalReference[0];
  if (/approved|approve|da duyet|phe duyet/.test(text))
    entities.approvalStatus = "claimed";
  for (const [key, pattern] of Object.entries({
    cpu: /(\d+)\s*vcpu/,
    ram: /(\d+)\s*gb\s*ram/,
    disk: /(?:disk\s*)(\d+)\s*gb/,
    quantity: /(\d+)\s*(?:x\s*)?(?:gpu|a100|h100|t4)/,
  })) {
    const match = text.match(pattern);
    if (match) entities[key] = match[1];
  }
  const gpu = text.match(/\b(a100|h100|t4|a10)\b/);
  if (gpu) entities.gpuType = gpu[1];
  const semanticAction =
    intentLabel === "DATABASE_EXPORT"
      ? "export"
      : intentLabel === "DEVICE_WIPE"
        ? "wipe"
        : intentLabel === "DEVICE_FACTORY_RESET"
          ? "factory reset"
          : intentLabel === "PORT_OPEN_REQUEST"
            ? "change"
            : requestKind === "GUIDANCE"
              ? "guidance"
              : requestKind === "SAFE_DIAGNOSTIC"
                ? "diagnose"
                : requestKind === "ACCESS_REQUEST"
                  ? "access"
                  : "request";
  return {
    language: /[ăâđêôơưáàạảãéèẹẻẽíìịỉĩóòọỏõúùụủũýỳỵỷỹ]/i.test(rawText)
      ? /\b(access|help|production|read|write|vpn|reset|admin)\b/i.test(rawText)
        ? "mixed"
        : "vi"
      : "en",
    requestKind,
    serviceGroup,
    intentLabel,
    entities,
    environment,
    requestedAction: semanticAction,
    riskSignals,
    missingFields: [],
    evidence: [{ field: "input", quote: rawText || "Structured intake" }],
    ambiguities: [],
  };
}

export function safeInput(input: SupportInput): {
  input: SupportInput;
  markers: string[];
} {
  const raw = redact(input.rawText);
  const markers = new Set(raw.markers);
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(input.fields)) {
    const safe = redact(value);
    fields[key] = safe.text;
    safe.markers.forEach((marker) => markers.add(marker));
  }
  return {
    input: { ...input, rawText: raw.text, fields },
    markers: [...markers],
  };
}

export function extractIntake(
  input: SupportInput,
  redactions: string[] = [],
): CanonicalRequest {
  const extracted = extractText(input.rawText);
  const fields = Object.fromEntries(
    Object.entries(input.fields).filter(
      ([, value]) =>
        value.trim() && !["unknown", "Unknown", "not_provided"].includes(value),
    ),
  );
  const risks = new Set(extracted.riskSignals);
  // Selected service is a routing hint, not a risk override. Explicit facts are checked independently.
  for (const key of [
    "environment",
    "permission",
    "system",
    "duration",
    "provider",
    "accessType",
    "requestedAction",
    "operation",
  ]) {
    if (
      fields[key] &&
      extracted.entities[key] &&
      normalize(fields[key]) !== normalize(extracted.entities[key])
    )
      risks.add("CONFLICT");
  }
  const selectedIntent = fields.intentLabel;
  if (
    selectedIntent &&
    extracted.intentLabel !== "UNKNOWN_SUPPORT_REQUEST" &&
    input.rawText &&
    selectedIntent !== extracted.intentLabel
  )
    risks.add("CONFLICT");
  if (
    input.mode === "structured" &&
    input.rawText &&
    input.serviceGroup !== "OTHER" &&
    extracted.serviceGroup !== "OTHER" &&
    input.serviceGroup !== extracted.serviceGroup
  )
    risks.add("CONFLICT");
  if (
    input.requestKind &&
    input.requestKind !== "OTHER" &&
    input.rawText &&
    extracted.requestKind !== "OTHER" &&
    input.requestKind !== extracted.requestKind
  )
    risks.add("CONFLICT");
  let serviceGroup = extracted.serviceGroup;
  let intentLabel = extracted.intentLabel;
  if (!input.rawText || extracted.intentLabel === "UNKNOWN_SUPPORT_REQUEST") {
    serviceGroup = input.serviceGroup;
    if (selectedIntent && validIntent(serviceGroup, selectedIntent))
      intentLabel = selectedIntent;
  }
  const entities = { ...extracted.entities, ...fields };
  const env = fields.environment as Environment | undefined;
  const environment = env ?? extracted.environment;
  let requestedAction =
    fields.requestedAction || fields.operation || extracted.requestedAction;
  let requestKind = input.requestKind ?? extracted.requestKind;
  if (selectedIntent && !input.rawText) {
    if (/GUIDANCE|HELP|LOOKUP|PASSWORD_RESET/.test(selectedIntent))
      requestKind = "GUIDANCE";
    else if (
      /FREEZE|WONT_BOOT|SLOW|CRASH|VPN_|WIFI_|LOGIN|LOCKED|MFA_|SSO_|DISPLAY|AUDIO|PRINTER|CAMERA|FAILED/.test(
        selectedIntent,
      )
    )
      requestKind = "SAFE_DIAGNOSTIC";
    else if (/ACCESS|PERMISSION|MEMBERSHIP|ROLE|ACCOUNT/.test(selectedIntent))
      requestKind = "ACCESS_REQUEST";
    else if (
      /INCIDENT|OUTAGE|MALWARE|PHISHING|LOST|STOLEN/.test(selectedIntent)
    )
      requestKind = "INCIDENT";
    else requestKind = "ROUTINE_WORKFLOW";
    if (!fields.requestedAction && !fields.operation)
      requestedAction =
        requestKind === "GUIDANCE"
          ? "guidance"
          : requestKind === "SAFE_DIAGNOSTIC"
            ? "diagnose"
            : "request";
  }
  if (
    ["wipe", "delete", "deploy", "change", "replace"].includes(
      requestedAction,
    ) ||
    (fields.operation && !["query_help", "read"].includes(fields.operation))
  )
    requestKind = "CONFIGURATION_CHANGE";
  detectedRisks(
    Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join("; "),
  ).forEach((risk) => risks.add(risk));
  if (
    [entities.permission, entities.accessType, entities.privilegeLevel].some(
      (value) =>
        /^(admin|root|owner|maintain|cluster-admin)$/.test(value ?? ""),
    )
  )
    risks.add("PRIVILEGED");
  if (["publicIp", "publicExposure"].some((key) => fields[key] === "yes"))
    risks.add("PUBLIC_EXPOSURE");
  if (
    ["containsSecret", "secretAccess", "secretChange"].some(
      (key) => fields[key] === "yes",
    ) ||
    redactions.length
  )
    risks.add("SECRET");
  if (
    environment === "production" &&
    ((requestKind === "ACCESS_REQUEST" &&
      (serviceGroup !== "DATABASE" ||
        !["read", "read-only"].includes(entities.permission ?? ""))) ||
      requestKind === "CONFIGURATION_CHANGE" ||
      (["DATABASE", "CLOUD_GPU", "KUBERNETES", "CI_CD"].includes(
        serviceGroup,
      ) &&
        requestKind === "ROUTINE_WORKFLOW"))
  )
    risks.add("PRODUCTION_CHANGE");
  if (
    /WIPE|FACTORY_RESET|RESOURCE_DELETE|DATA_DELETE|DEVICE_REPLACEMENT/.test(
      intentLabel,
    ) ||
    /^(wipe|delete|replace|factory reset)$/.test(requestedAction)
  )
    risks.add("DESTRUCTIVE");
  if (/ADMIN|ROOT/.test(intentLabel)) risks.add("PRIVILEGED");
  if (/SECRET|CREDENTIAL/.test(intentLabel)) risks.add("SECRET");
  if (/PUBLIC_EXPOSURE|PUBLIC_IP|REMOTE_ACCESS/.test(intentLabel))
    risks.add("PUBLIC_EXPOSURE");
  if (/MFA_DISABLE|EDR_DISABLE|BYPASS_APPROVAL/.test(intentLabel))
    risks.add("SECURITY_CONTROL");
  if (/UNSIGNED|UNAPPROVED/.test(intentLabel)) risks.add("UNAPPROVED_SOFTWARE");
  if (
    /DNS_CHANGE|FIREWALL_CHANGE|PROXY_CONFIG|CONFIG_CHANGE|MANIFEST_CHANGE|INGRESS_CHANGE|ALERT_THRESHOLD|ALERT_ROUTING|GPU_QUOTA|CLOUD_BUDGET/.test(
      intentLabel,
    )
  )
    risks.add("CONTROL_CHANGE");
  if (fields.configChange === "yes") risks.add("CONTROL_CHANGE");
  if (
    requestKind === "INCIDENT" ||
    (serviceGroup === "SECURITY" && intentLabel !== "COMPLIANCE_QUESTION")
  )
    risks.add("INCIDENT");
  if (
    /DATA_EXPORT|DATABASE_EXPORT/.test(intentLabel) &&
    (fields.productionData === "yes" ||
      ["customer", "confidential"].includes(fields.dataSensitivity ?? "") ||
      environment === "production")
  )
    risks.add("DATA_EXPORT");
  const parts = input.rawText
    .split(
      /(?:\n|;|\.\s+|\b(?:nhưng|nhung|but|tiện thể|tien the|ngoài ra|ngoai ra|and also|and then|then|đồng thời|dong thoi|cùng lúc|cung luc)\b|\band\s+(?=(?:grant|give|open|disable|turn|export|deploy|delete|restart|create|cap|mo|tat|xuat|trien khai)\b))/i,
    )
    .map((part) => part.trim())
    .filter(Boolean);
  let subrequests = parts.length > 1 ? parts.map(extractText) : [];
  if (
    extracted.intentLabel === "DEVICE_RESTART_GUIDANCE" &&
    /(?:khong|not)\s+factory reset/.test(normalize(input.rawText))
  )
    subrequests = subrequests.filter(
      (part) => part.intentLabel !== "DEVICE_RESET_GUIDANCE",
    );
  if (subrequests.length > 1 && Object.keys(fields).length)
    risks.add("CONFLICT");
  subrequests.forEach((part) =>
    part.riskSignals.forEach((risk) => risks.add(risk)),
  );
  const evidence = input.rawText ? extracted.evidence : [];
  for (const [field, value] of Object.entries(fields))
    evidence.push({ field, quote: `${field}=${value}` });
  return {
    ...extracted,
    serviceGroup,
    intentLabel,
    requestKind,
    entities,
    environment,
    requestedAction,
    riskSignals: [...risks],
    evidence,
    subrequests,
    redactions,
    model: { source: "deterministic" },
  };
}

export function teamFor(group: ServiceGroup) {
  return catalog[group].team;
}

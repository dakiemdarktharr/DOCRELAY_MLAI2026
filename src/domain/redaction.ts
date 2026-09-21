// Redact before extraction, persistence, audit and response. Never retain the original secret.
export function redact(text: string): { text: string; markers: string[] } {
  const markers = new Set<string>();
  let safe = text;
  const replace = (pattern: RegExp, marker: string, replacement: string) => {
    safe = safe.replace(pattern, () => {
      markers.add(marker);
      return replacement;
    });
  };
  replace(
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?(?:-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|$)/gi,
    "PRIVATE_KEY",
    "[REDACTED_PRIVATE_KEY]",
  );
  replace(
    /\b(?:sk-[A-Za-z0-9_-]{8,}|gh[pousr]_[A-Za-z0-9_]{8,}|github_pat_[A-Za-z0-9_]+|(?:AKIA|ASIA)[A-Z0-9]{16})\b/g,
    "TOKEN",
    "[REDACTED_TOKEN]",
  );
  safe = safe.replace(
    /\b((?:aws_secret_access_key|aws_session_token|client_secret|access_token|refresh_token|private_key)\s*=\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi,
    (_, prefix: string) => {
      markers.add("SECRET_VALUE");
      return prefix + "[REDACTED]";
    },
  );
  safe = safe.replace(
    /((?:mã xác minh|ma xac minh|mã otp|ma otp|\botp|verification code|one[ -]time code)\s*(?::|=|là|la|is)?\s*)[0-9]{4,10}\b/gi,
    (_, prefix: string) => {
      markers.add("VERIFICATION_CODE");
      return prefix + "[REDACTED_VERIFICATION_CODE]";
    },
  );
  replace(/\bBearer\s+[^\s,;]+/gi, "TOKEN", "Bearer [REDACTED_TOKEN]");
  replace(
    /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    "TOKEN",
    "[REDACTED_TOKEN]",
  );
  safe = safe.replace(
    /\b((?:aws[ _-]?(?:secret[ _-]?access[ _-]?key|access[ _-]?key[ _-]?id|session[ _-]?token)|secret[ _-]?access[ _-]?key|access[ _-]?key[ _-]?id|password|passwd|pwd|token|api[ _-]?key|secret|credential|mật khẩu|mat khau|private[ _-]?key)\s*["']?\s*(?:[:=]|\bis\b|là(?=\s))\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi,
    (_, prefix: string) => {
      markers.add("SECRET_VALUE");
      return prefix + "[REDACTED]";
    },
  );
  // Tickets frequently paste `token VALUE` without `=` or `:`. Keep common
  // support phrases such as "password reset" intact, but redact value-like
  // material before it reaches extraction, persistence, audit or a model.
  safe = safe.replace(
    /\b((?:password|passwd|pwd|token|api[ _-]?key|secret|credential|mật khẩu|mat khau)\s+)(?!reset\b|change\b|setup\b|policy\b|field\b)([A-Za-z0-9_./+@-]{6,})\b/gi,
    (_, prefix: string) => {
      markers.add("SECRET_VALUE");
      return prefix + "[REDACTED]";
    },
  );
  safe = safe.replace(
    /(\b[a-z][a-z0-9+.-]*:\/\/)[^\s/@:]+:[^\s/@]+@/gi,
    (_, protocol: string) => {
      markers.add("CONNECTION_CREDENTIAL");
      return protocol + "[REDACTED]@";
    },
  );
  return { text: safe, markers: [...markers] };
}

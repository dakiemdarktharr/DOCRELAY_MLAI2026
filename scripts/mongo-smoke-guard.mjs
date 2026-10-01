// Intentionally restricted to a separately started local, disposable Mongo.
// No credential, DNS hostname, SRV, replica set, URI options or database override.
export function validateMongoSmokeConfig(env, files) {
  if (env.SUPPORT_TEST_MONGO_ACK !== "isolated-local-synthetic")
    throw new Error("Explicit isolated local test acknowledgement required.");
  const uri = env.SUPPORT_TEST_MONGO_URI || "";
  const match = /^mongodb:\/\/127\.0\.0\.1:([0-9]{4,5})\/$/.exec(uri);
  const port = Number(match?.[1]);
  if (!match || port < 1024 || port > 65535 || port === 3227)
    throw new Error("Only mongodb://127.0.0.1:<test-port>/ is accepted.");
  if (env.VERCEL || env.MONGODB_URI || env.MONGODB_DB)
    throw new Error("Unset deployment and application Mongo environment first.");
  if (files.some((file) => /^\.env(?:\.|$)/.test(file) && file !== ".env.example"))
    throw new Error("Use a clean checkout without local environment files.");
  return uri;
}

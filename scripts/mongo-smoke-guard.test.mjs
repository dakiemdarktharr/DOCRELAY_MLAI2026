import { test } from "node:test";
import assert from "node:assert/strict";
import { validateMongoSmokeConfig } from "./mongo-smoke-guard.mjs";
const env = { SUPPORT_TEST_MONGO_ACK: "isolated-local-synthetic", SUPPORT_TEST_MONGO_URI: "mongodb://127.0.0.1:27028/" };
test("accepts only explicit isolated loopback Mongo with no environment files", () => {
  assert.equal(validateMongoSmokeConfig(env, [".env.example"]), env.SUPPORT_TEST_MONGO_URI);
});
for (const uri of ["mongodb+srv://example.test/", "mongodb://example.test:27028/", "mongodb://localhost:27028/", "mongodb://user:synthetic@127.0.0.1:27028/", "mongodb://127.0.0.1:27028/production", "mongodb://127.0.0.1:27028/?replicaSet=prod", "mongodb://127.0.0.1:3227/", "mongodb://127.0.0.1:99999/", ""]) {
  test(`rejects unsafe or ambiguous target ${uri}`, () => assert.throws(() => validateMongoSmokeConfig({ ...env, SUPPORT_TEST_MONGO_URI: uri }, [])));
}
test("rejects application Mongo, deployment and dotenv even with acknowledgement", () => {
  for (const key of ["MONGODB_URI", "MONGODB_DB", "VERCEL"])
    assert.throws(() => validateMongoSmokeConfig({ ...env, [key]: "synthetic" }, []));
  for (const file of [".env", ".env.local", ".env.production", ".env.production.local"])
    assert.throws(() => validateMongoSmokeConfig(env, [file]));
  assert.throws(() => validateMongoSmokeConfig({ ...env, SUPPORT_TEST_MONGO_ACK: "" }, []));
});

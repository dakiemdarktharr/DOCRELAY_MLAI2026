import { test as base } from "@playwright/test";
import { createHash } from "node:crypto";
export { expect, type Page } from "@playwright/test";

// Each test models an independent client. Keep production rate limiting enabled
// without making unrelated scenarios exhaust a shared loopback-IP allowance.
export const freshTest = base.extend({
  extraHTTPHeaders: async ({}, provideHeaders, info) => {
    const hash = createHash("sha256").update(`${info.project.name}:${info.testId}`).digest();
    await provideHeaders({ "x-forwarded-for": `198.18.${hash[0]}.${hash[1]}` });
  },
});

// Existing workflow regressions exercise a returning visitor. The onboarding
// suite uses freshTest and tests fresh tabs with no seeded flags.
export const test = freshTest.extend<{ returningVisitor: void }>({
  returningVisitor: [async ({ page }, use) => {
    await page.addInitScript(() => {
      for (const role of ["intro", "sender", "reviewer"]) {
        sessionStorage.setItem(`vng-guide-v1:${role}`, "seen");
      }
    });
    await use();
  }, { auto: true }],
});

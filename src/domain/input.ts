import { z } from "zod";
import {
  allFields,
  catalog,
  commonFields,
  fieldOptions,
  validIntent,
} from "./catalog";
import { requestKinds, serviceGroups } from "./contracts";

export const supportInputSchema = z
  .object({
    mode: z.enum(["freeform", "structured"]).default("freeform"),
    serviceGroup: z.enum(serviceGroups).default("OTHER"),
    requestKind: z.enum(requestKinds).optional(),
    rawText: z.string().trim().max(6000).default(""),
    fields: z.record(z.string().trim().max(300)).default({}),
    confirmed: z.boolean().default(false),
    idempotencyKey: z.string().uuid(),
    previewId: z.string().uuid().optional(),
  })
  .strict()
  .superRefine((input, ctx) => {
    if (!input.rawText && !Object.values(input.fields).some(Boolean))
      ctx.addIssue({
        code: "custom",
        path: ["rawText"],
        message: "Nhập mô tả hoặc chọn nhu cầu cụ thể.",
      });
    for (const [key, value] of Object.entries(input.fields)) {
      if (!allFields.has(key))
        ctx.addIssue({
          code: "custom",
          path: ["fields", key],
          message: "Field không được hỗ trợ.",
        });
      if (value && fieldOptions[key] && !fieldOptions[key].includes(value))
        ctx.addIssue({
          code: "custom",
          path: ["fields", key],
          message: "Giá trị không hợp lệ.",
        });
      if (
        input.mode === "structured" &&
        key !== "intentLabel" &&
        !commonFields.includes(key) &&
        !catalog[input.serviceGroup].fields.includes(key)
      )
        ctx.addIssue({
          code: "custom",
          path: ["fields", key],
          message: "Field không thuộc service group đã chọn.",
        });
    }
    if (
      input.fields.intentLabel &&
      !validIntent(input.serviceGroup, input.fields.intentLabel)
    )
      ctx.addIssue({
        code: "custom",
        path: ["fields", "intentLabel"],
        message: "Nhu cầu không thuộc nhóm đã chọn.",
      });
  });

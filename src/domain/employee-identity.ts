import { fieldOptions } from "./catalog";

export const identityRequiredMessage =
  "Chọn phòng ban trước khi gửi yêu cầu.";

export function isEmployeeIdentityField(field: string) {
  return field === "department" || field === "employeeId";
}

export function hasEmployeeIdentity(fields: Record<string, string>) {
  return fieldOptions.department.includes(fields.department?.trim());
}

export function employeeIdentityOnly(fields: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(fields).filter(([field]) => isEmployeeIdentityField(field)),
  );
}

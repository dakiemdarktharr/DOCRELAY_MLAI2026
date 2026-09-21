import { fieldOptions, labelForField } from "@/domain/catalog";
import { optionName } from "@/domain/presentation";
import { hintFor } from "@/domain/questions";
import { Input } from "./ui";
export function SupportField({
  field,
  value,
  onChange,
}: {
  field: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const name = field === "verifiedApproval" ? "approvalReference" : field;
  return (
    <label>
      {labelForField(name)}
      {fieldOptions[name] ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Tôi không biết / chưa cung cấp</option>
          {fieldOptions[name].map((option) => (
            <option key={option} value={option}>
              {optionName(option)}
            </option>
          ))}
        </select>
      ) : (
        <Input
          value={value}
          maxLength={300}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      <span className="field-hint">{hintFor(field)}</span>
    </label>
  );
}

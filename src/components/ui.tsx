import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
}) {
  return <button className={cx("button", variant, className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("panel", className)} {...props} />;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-slate-100 text-slate-700",
        tone === "success" && "bg-emerald-100 text-emerald-700",
        tone === "warning" && "bg-amber-100 text-amber-800",
        tone === "danger" && "bg-red-100 text-red-700",
      )}
    >
      {children}
    </span>
  );
}

export function Alert({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  return (
    <div
      className={cx(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "info" && "border-line bg-[#e8edda] text-ink",
        tone === "error" && "border-red-200 bg-red-50 text-red-800",
        tone === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {children}
    </div>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={className} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx("min-h-36", className)} {...props} />;
}

export function Spinner() {
  return (
    <span
      aria-label="Loading"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="min-w-full divide-y divide-line text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button
            className="text-2xl leading-none text-slate-400 hover:text-ink"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

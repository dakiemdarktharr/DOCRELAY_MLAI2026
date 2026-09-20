import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Workspace", "/workspace"],
  ["Reviewer", "/review"],
  ["Verify", "/verify"],
  ["Audit", "/audit"],
] as const;

export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link
          href="/"
          className="text-base font-extrabold tracking-tight text-ink"
        >
          VNG <span className="text-accent">SUPPORT REFEREE</span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-1"
          aria-label="Primary navigation"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-2 py-2 text-sm font-medium text-slate-600 hover:bg-paper hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

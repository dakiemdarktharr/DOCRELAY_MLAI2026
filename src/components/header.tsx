import Link from "next/link";
import { ArrowUpRight, Files } from "lucide-react";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-mark">
          <Files size={25} strokeWidth={2.5} />
        </span>
        IT Referee
      </Link>
      <nav aria-label="Điều hướng chính">
        <Link href="/send-help">
          I Need Help <ArrowUpRight size={15} />
        </Link>
        <Link href="/review">Human Reviewer</Link>
        <Link href="/audit">Audit</Link>
        <Link href="/verify">Verify</Link>
      </nav>
      <span className="demo-badge">
        <span /> DEMO MODE
      </span>
    </header>
  );
}

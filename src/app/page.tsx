import Link from "next/link";
import { NaviArt } from "@/components/navi-art";

export default function Home() {
  return (
    <main className="role-entry" aria-label="Chọn vai trò">
      <div className="role-entry-backdrop" aria-hidden="true">
        <NaviArt id="navi-entry" />
      </div>
      <div className="role-entry-actions">
        <Link className="button role-entry-button" href="/review">
          admin
        </Link>
        <Link className="button role-entry-button" href="/send-help">
          I need help
        </Link>
      </div>
    </main>
  );
}

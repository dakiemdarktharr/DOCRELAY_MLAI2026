import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { NaviCursor } from "@/components/navi-cursor";
import "./globals.css";

const nunito = localFont({
  src: "./fonts/Nunito.ttf",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
});
const baloo = localFont({
  src: "./fonts/Baloo2.ttf",
  variable: "--font-baloo",
  weight: "400 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VNG Support Referee | MLAI Project",
  description:
    "Hỗ trợ kỹ thuật, hướng dẫn an toàn và chuyển reviewer theo policy xác định.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${nunito.variable} ${baloo.variable}`}>
      <body>
        <NaviCursor />
        <Header />
        <div className="mobile-disclosure">
          MVP · Dữ liệu synthetic · Mô phỏng thao tác IT
        </div>
        {children}
        <footer>
          <span>Escalation Referee / MLAI 2026</span>
          <span>Policy rõ ràng · Có human review</span>
          <Link href="/verify">Verify Harness ↗</Link>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "VNG Support Referee | MLAI Project",
  description:
    "Hỗ trợ kỹ thuật, hướng dẫn an toàn và chuyển reviewer theo policy xác định.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}

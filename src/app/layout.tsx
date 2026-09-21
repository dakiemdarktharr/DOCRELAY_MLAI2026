import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import "./globals.css";

const nunito = localFont({
  src: "./fonts/Nunito.ttf",
  variable: "--font-nunito",
  weight: "200 1000",
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
    <html lang="vi" className={nunito.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="page">{children}</main>;
}

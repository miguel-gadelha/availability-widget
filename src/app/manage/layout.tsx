export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-red-300 h-screen w-full">{children}</section>;
}

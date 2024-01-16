export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white flex justify-center items-center h-screen w-full">
      {children}
    </section>
  );
}

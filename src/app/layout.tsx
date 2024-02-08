import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Availability Widget",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-white flex justify-center items-center h-screen w-full">
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  );
}

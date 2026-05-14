import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inner Atlas — Your Second Brain",
  description:
    "A personal second brain inspired by Brené Brown, Oprah Winfrey, Andrew Huberman, and Diary of a CEO. Explore frameworks, chat with an AI life coach, and journal your way to clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}

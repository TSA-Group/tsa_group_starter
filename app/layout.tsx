import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gatherly",
  description: "Location Datasets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Header />
        <main className="min-h-screen pt-24 bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF]">
          {children}
        </main>
      </body>
    </html>
  );
}

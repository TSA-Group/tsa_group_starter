import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { geistSans, geistMono } from "./fonts";

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
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="min-h-screen pt-24 bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF]">
          {children}
        </main>
      </body>
    </html>
  );
}

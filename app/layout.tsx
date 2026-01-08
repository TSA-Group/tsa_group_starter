import type { Metadata } from "next";
import { Geist_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // default import

const geistSans = Geist_Sans({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gatherly",
  description: "Location Datasets",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
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

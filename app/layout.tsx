import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { GeistSans, GeistMono } from "geist/font";

const geistSans = GeistSans({
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
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


// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import RouteShell from "./route-shell";
import { RouteTransition } from "./route-transition"; // <-- fixed path

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gatherly",
  description: "Location Datasets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap the children in both RouteTransition and RouteShell */}
        <RouteTransition>
          <RouteShell>{children}</RouteShell>
        </RouteTransition>
      </body>
    </html>
  );
}


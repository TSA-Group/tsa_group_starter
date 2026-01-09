"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // ✅ Admin pages: no global header, no padding, no forced background
  if (isAdmin) {
    return <>{children}</>;
  }

  // ✅ Normal pages: header + padded content + light theme background
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF]">
        {children}
      </main>
    </>
  );
}

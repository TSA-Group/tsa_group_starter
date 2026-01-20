"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF]">
        {children}
      </main>
    </>
  );
}

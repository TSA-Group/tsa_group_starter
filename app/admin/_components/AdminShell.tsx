//Shared layout + Protection + header

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const authed = localStorage.getItem("admin_authed") === "1";
    if (!authed) router.replace("/admin");
  }, [router]);

  const logout = () => {
    localStorage.removeItem("admin_authed");
    router.replace("/admin");
  };

  const nav = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Add Resource", href: "/admin/resources/new" },
    { label: "Add Event", href: "/admin/events/new" },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-lg font-extrabold tracking-tight">
              Admin
              <span className="ml-2 text-white/45 font-semibold">•</span>
              <span className="ml-2 text-white/75 text-sm font-semibold">
                Cross Creek Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-2">
              {nav.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link key={n.href} href={n.href}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      className={`px-3 py-2 rounded-xl border text-sm transition
                        ${
                          active
                            ? "border-blue-500/40 bg-blue-500/15 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                    >
                      {n.label}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={logout}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 hover:bg-white/10 transition"
            >
              Log out
            </motion.button>
          </div>
        </div>
      </div>

      {/* page header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-white/70">{subtitle}</p>}
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-14">{children}</div>
    </div>
  );
}

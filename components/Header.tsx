"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Resources", href: "/map" },
  { label: "Events", href: "/events" },
  { label: "History", href: "/history" },
  { label: "Contact", href: "/contact" },
  { label: "References", href: "/references" },
  { label: "Login", href: "/admin" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [open, setOpen] = useState(false);

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const headerClass = isAdmin
    ? `
        fixed top-0 left-0 w-full z-50
        bg-[#070A12]/70 backdrop-blur-2xl
        border-b border-white/10
        shadow-[0_10px_35px_rgba(0,0,0,0.55)]
        text-white
      `
    : `
        fixed top-0 left-0 w-full z-50
        bg-white/70 backdrop-blur-xl
        border-b border-blue-600/80
        shadow-sm
        text-blue-600/80
      `;

  const logoClass = isAdmin
    ? "font-extrabold tracking-tight cursor-pointer text-white"
    : "font-extrabold tracking-tight cursor-pointer text-blue-600/80";

  const linkClass = isAdmin
    ? "relative text-white/80 hover:text-white transition-colors duration-200"
    : "relative text-blue-600/80 hover:text-gray-950 transition-colors duration-200";

  const underlineClass = isAdmin ? "bg-white/70" : "bg-blue-500";

  const burgerLine = isAdmin ? "bg-white/85" : "bg-blue-600/80";
  const mobilePanelBg = isAdmin
    ? "bg-[#070A12]/85 border-white/10"
    : "bg-white/80 border-blue-200";

  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={headerClass}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <motion.h1
            whileHover={{
              scale: 1.05,
              textShadow: isAdmin
                ? "0px 0px 12px rgba(255,255,255,0.12)"
                : "0px 0px 8px rgba(37, 99, 235, 0.25)",
            }}
            transition={{ type: "spring", stiffness: 260 }}
            className={`${logoClass} text-2xl sm:text-3xl`}
            style={{ fontFamily: "TAN Buster, sans-serif" }}
          >
            Gatherly
          </motion.h1>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex gap-10 text-base font-medium ml-auto">
          {navItems.map(({ label, href }) => {
            const active =
              pathname === href || (href !== "/" && pathname?.startsWith(href));

            return (
              <Link key={label} href={href} className="relative">
                <motion.span
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={linkClass}
                >
                  {label}
                  <span
                    className={`
                      absolute left-0 -bottom-1 h-[2px]
                      ${active ? "w-full" : "w-0"}
                      ${underlineClass}
                      transition-all duration-300
                    `}
                  />
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto inline-flex items-center justify-center rounded-2xl border px-3 py-2 backdrop-blur-xl"
          style={{
            borderColor: isAdmin ? "rgba(255,255,255,0.10)" : "rgba(37,99,235,0.25)",
            backgroundColor: isAdmin ? "rgba(7,10,18,0.25)" : "rgba(255,255,255,0.45)",
          }}
        >
          <motion.span
            initial={false}
            animate={open ? "open" : "closed"}
            className="relative h-5 w-6"
          >
            <motion.span
              className={`absolute left-0 top-0 h-[2px] w-6 rounded-full ${burgerLine}`}
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 9 },
              }}
              transition={{ duration: 0.22 }}
            />
            <motion.span
              className={`absolute left-0 top-[9px] h-[2px] w-6 rounded-full ${burgerLine}`}
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.18 }}
            />
            <motion.span
              className={`absolute left-0 bottom-0 h-[2px] w-6 rounded-full ${burgerLine}`}
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -9 },
              }}
              transition={{ duration: 0.22 }}
            />
          </motion.span>
        </button>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`md:hidden border-t ${mobilePanelBg} backdrop-blur-2xl`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="grid gap-1">
                {navItems.map(({ label, href }) => {
                  const active =
                    pathname === href ||
                    (href !== "/" && pathname?.startsWith(href));

                  return (
                    <Link
                      key={label}
                      href={href}
                      className="relative"
                      onClick={() => setOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={[
                          "flex items-center justify-between rounded-2xl px-4 py-3 font-semibold",
                          isAdmin
                            ? "text-white/90 hover:bg-white/10"
                            : "text-blue-700 hover:bg-blue-50",
                          active
                            ? isAdmin
                              ? "bg-white/10"
                              : "bg-blue-100/60"
                            : "",
                        ].join(" ")}
                      >
                        <span>{label}</span>
                        <span
                          className={[
                            "h-[2px] w-10 rounded-full",
                            active ? (isAdmin ? "bg-white/70" : "bg-blue-500") : "bg-transparent",
                          ].join(" ")}
                        />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

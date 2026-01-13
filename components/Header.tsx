"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Resources", href: "/map" },
  { label: "Events", href: "/events" },
  { label: "History", href: "/history" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/admin" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

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
    ? "text-3xl font-extrabold tracking-tight cursor-pointer text-white"
    : "text-3xl font-extrabold tracking-tight cursor-pointer text-blue-600/80";

  const linkClass = isAdmin
    ? "relative text-white/80 hover:text-white transition-colors duration-200"
    : "relative text-blue-600/80 hover:text-gray-950 transition-colors duration-200";

  const underlineClass = isAdmin ? "bg-white/70" : "bg-blue-500";

  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={headerClass}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <motion.h1
            whileHover={{
              scale: 1.05,
              textShadow: isAdmin
                ? "0px 0px 12px rgba(255,255,255,0.12)"
                : "0px 0px 8px rgba(37, 99, 235, 0.25)",
            }}
            transition={{ type: "spring", stiffness: 260 }}
            className={logoClass}
            style={{ fontFamily: "TAN Buster, sans-serif" }}
          >
            Gatherly
          </motion.h1>
        </Link>

        <nav className="flex gap-10 text-base font-medium ml-auto">
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
      </div>
    </motion.header>
  );
};

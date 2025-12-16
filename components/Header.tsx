"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Resources", href: "/map" }, 
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/70 backdrop-blur-xl
        border-b border-gray-200
        shadow-sm
        text-gray-900
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" passHref>
          <motion.h1
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 8px rgba(37, 99, 235, 0.25)",
            }}
            transition={{ type: "spring", stiffness: 260 }}
            className="text-3xl font-extrabold tracking-tight cursor-pointer text-gray-950"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
          >
            Gatherly
          </motion.h1>
        </Link>

        {/* NAV */}
        <nav className="flex gap-10 text-base font-medium ml-auto">
          {navItems.map(({ label, href }) => (
            <motion.a
              key={label}
              href={href}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                relative text-gray-700
                hover:text-blue-600
                transition-colors duration-200
              "
            >
              {label}

              <span
                className="
                  absolute left-0 -bottom-1 h-[2px] w-0
                  bg-blue-500
                  transition-all duration-300
                "
              />
            </motion.a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};

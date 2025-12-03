"use client";
import { motion } from "framer-motion";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = ["Home", "Resources", "Events", "Contact"];

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      className="backdrop-blur-md bg-black/60 text-green-400 shadow-md fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo aligned left */}
        <motion.h1
          whileHover={{ scale: 1.1, textShadow: "0px 0px 8px #22c55e" }}
          className="text-4xl font-bold tracking-wide"
        >
          Gatherly
        </motion.h1>

        {/* Navigation and Theme Toggle */}
        <div className="flex items-center gap-6 ml-auto">
          <nav className="flex gap-10 text-lg font-medium">
            {navItems.map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="hover:text-white transition-colors duration-200"
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Theme toggle button */}
          <ThemeToggle />
        </div>

      </div>
    </motion.header>
  );
};

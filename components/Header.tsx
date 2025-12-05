"use client";
import { motion } from "framer-motion";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = ["Map", "Events", "Contact"];

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-base-200/30 backdrop-blur-xl text-base-content shadow-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.h1
          whileHover={{
            scale: 1.05,
            textShadow: "0px 0px 10px rgba(38,166,154,0.8)",
          }}
          className="text-4xl font-bold tracking-wide"
        >
          Gatherly
        </motion.h1>

        <div className="flex items-center gap-6 ml-auto">
          <nav className="flex gap-10 text-lg font-medium">
            {navItems.map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.05, color: "#26A69A" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="hover:text-[#26A69A] transition-colors duration-200"
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* 👇 The ONLY place ThemeToggle exists */}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

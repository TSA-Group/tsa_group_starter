"use client";
import { motion } from "framer-motion";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = ["Home", "Resources", "Events", "Contact"];
const LIGHTGRAY_ = "#CFD8DC";
const DARKGRAY_ = "#37474F";
const TEAL_ = "#26A69A";
export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 bg-[${LIGHTGRAY_}]/30 backdrop-blur-xl text-[${DARKGRAY_}] shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.h1
          whileHover={{
            scale: 1.05,
            textShadow: "0px 0px 10px rgba(38,166,154,0.8)",
          }}
          className="text-4xl font-bold tracking-wide text-[${DARKGRAY_}]"
        >
          Gatherly
        </motion.h1>

        <div className="flex items-center gap-6 ml-auto">
          <nav className="flex gap-10 text-lg font-medium">
            {navItems.map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.05, color: TEAL_ }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`hover:text-[${TEAL_}] text-[${DARKGRAY_}] transition-colors duration-200`}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

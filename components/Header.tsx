"use client";
import { motion } from "framer-motion";
import React from "react";

const navItems = ["Home", "Resources", "Events", "Contact"];

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-black text-green-400 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        
        <motion.h1
          whileHover={{ scale: 1.05, textShadow: "0px 0px 8px #22c55e" }}
          className="text-4xl font-bold tracking-wide"
        >
          Gatherly
        </motion.h1>

        
        <nav className="flex gap-10 text-lg font-medium">
          {navItems.map((item) => (
            <motion.a
              key={item}
              whileHover={{ scale: 1.1, color: "#ffffff" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="hover:text-white transition-colors duration-200"
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </motion.a>
          ))}
        </nav>

      </div>
    </motion.header>
  );
};

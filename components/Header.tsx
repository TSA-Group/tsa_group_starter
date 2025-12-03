"use client";
import { motion } from "framer-motion";
import React from "react";

const navItems = ["Resources", "Events", "Contact"];

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      className="bg-[#CFD8DC]/90 text-[#37474F] shadow-md backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <motion.h1
          whileHover={{
            scale: 1.08,
            textShadow: "0px 0px 10px rgba(38,166,154,0.8)", // teal glow
          }}
          className="text-4xl font-bold tracking-wide text-[#37474F]"
        >
          Gatherly
        </motion.h1>

        {/* Navigation */}
        <nav className="flex gap-10 text-lg font-medium ml-auto">
          {navItems.map((item) => (
            <motion.a
              key={item}
              whileHover={{ scale: 1.1, color: "#26A69A" }} // teal hover
              transition={{ type: "spring", stiffness: 260 }}
              className="hover:text-[#26A69A] transition-colors duration-200 text-[#37474F]"
              href={`/${item.toLowerCase()}`}
            >
              {item}
            </motion.a>
          ))}
        </nav>

      </div>
    </motion.header>
  );
};

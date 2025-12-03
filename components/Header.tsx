"use client";
import { motion, useScroll } from "framer-motion";
import React, { useEffect, useState } from "react";

const navItems = ["Home", "Resources", "Events", "Contact"];

export const Header: React.FC = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (y) => {
      setScrolled(y > 10); // header becomes transparent after slight scroll
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled 
          ? "bg-[#CFD8DC]/30 backdrop-blur-xl shadow-sm"  // transparent w/ color tint
          : "bg-[#CFD8DC]/95 backdrop-blur-md shadow-md"  // solid neutral theme
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <motion.h1
          whileHover={{
            scale: 1.08,
            textShadow: "0px 0px 10px rgba(38,166,154,0.8)",
          }}
          className="text-4xl font-bold tracking-wide text-[#37474F]"
        >
          Gatherly
        </motion.h1>

        {/* Navigation */}
        <nav className="flex gap-10 text-lg font-medium ml-auto">
          {navItems.map((item) => {
            const isHome = item === "Home";

            return (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1, color: "#26A69A" }}
                transition={{ type: "spring", stiffness: 260 }}
                className="hover:text-[#26A69A] text-[#37474F] transition-colors duration-200"
                href={isHome ? "/" : `/${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            );
          })}
        </nav>

      </div>
    </motion.header>
  );
};

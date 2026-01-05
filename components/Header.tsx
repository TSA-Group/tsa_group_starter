"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

export default function HeroHeader() {
  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(1000); // default

  // Calculate scroll range after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScrollRange(document.body.scrollHeight - window.innerHeight);
    }
  }, []);

  // Scroll-based color
  const headerColor = useTransform(
    scrollY,
    [0, scrollRange],
    ["#1E3A8A", "#1E3F8A"]
  );

  // Variants for hero header
  const heroVariant: Variants = {
    hidden: { opacity: 0, x: 20, y: 0 },
    show: {
      opacity: 1,
      x: [20, 0, 20],
      y: [0, -6, 0],
      transition: { duration: 2.5, ease: "easeInOut" },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={{ show: {}, hidden: {} }} // parent variant for possible stagger
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10"
    >
      <motion.h1
        variants={heroVariant}
        style={{ color: headerColor, fontFamily: "TAN Buster, sans-serif" }}
        className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-center lg:text-left"
      >
        GATHERLY
      </motion.h1>
    </motion.header>
  );
}

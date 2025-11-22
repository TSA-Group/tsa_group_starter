// app/page.tsx  (or pages/index.tsx) — paste/replace your existing Home component file
"use client";

import React, { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const year = new Date().getFullYear();

  // hero box ref to track its scroll progress relative to viewport
  const boxRef = useRef<HTMLElement | null>(null);

  // framer-motion scroll tracking for hero left-move
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  // HSL background effect on page scroll — properly implemented with useEffect + cleanup
  useEffect(() => {
    function updateBackground() {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0; // defensive
      const hue = scrollPercent * 360;
      document.body.style.backgroundColor = `hsl(${hue}, 80%)`; // dark lightness to match your theme
    }

    // Add listener
    window.addEventListener("scroll", updateBackground, { passive: true });
    // Initial call
    updateBackground();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", updateBackground);
    };
  }, []); // empty deps -> attach once on mount, clean on unmount

  return (
    <>
      <Head>
        <title>Gatherly — Home</title>
        <meta name="description" content="Gatherly — Personal Geolocation Data Assembler" />
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap" rel="stylesheet" />
      </Head>

      {/* Animated Sticky Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 w-full z-50 bg-black"
      >
        <Header />
      </motion.div>

      {/* Page Content */}
      <div className="pt-24 min-h-screen flex flex-col items-center bg-black font-sans text-green-200">
        {/* Hero wrapper — centered at first, moves left as you scroll */}
        <div className="w-full max-w-6xl px-6 py-20 flex justify-center">
          <motion.section
            ref={boxRef as any}
            style={{ x, scale }}
            className="mx-auto w-full max-w-2xl border-l-4 border-green-500 bg-black p-10 rounded-xl shadow-xl"
          >
            <h2
              className="text-5xl font-bold leading-snug tracking-tight mb-6 text-green-400"
              style={{ fontFamily: "Momo Signature, sans-serif" }}
            >
              Your Personal Geolocation Data Assembler
            </h2>

            <p className="text-lg leading-relaxed mb-8 text-green-200">
              Gatherly helps you find, organize, and visualize nearby locations with precision.
              Explore local data, discover insights, and connect your maps like never before.
            </p>

            <Link
              href="/map"
              className="inline-block rounded-full bg-green-600 px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700"
            >
              Launch Maps
            </Link>
          </motion.section>
        </div>

        {/* Example scrollable content — you can tweak sizes/positions individually */}
        <div className="w-full max-w-4xl px-6 py-12 text-green-200 space-y-6">
          <div
            className="bg-black/40 rounded-lg border border-green-900"
            style={{
              height: "500px",
              width: "400px",
              marginLeft: "300px",
              marginBottom: "400px",
            }}
          />
          <div className="h-96 bg-black/40 rounded-lg border border-green-900" />
          <div className="h-96 bg-black/40 rounded-lg border border-green-900" />
        </div>

        {/* Optional floating heading so user sees "Scroll Down" — styled inside JSX, not <body> */}
        <h1 className="fixed top-5 left-5 text-white font-sans">Scroll Down</h1>

        {/* Footers */}
        <footer className="w-full p-4 text-left text-sm text-green-400 bg-black border-t border-green-900 mt-4">
          <p className="underline hover:text-green-400" style={{ color: "rgb(5,223,114)", fontSize: "14px" }}>
            <b>Contact Our Wonderful Community Staff At:</b>
          </p>

          <div style={{ fontSize: "10px" }}>
            <a href="mailto:Gatherly@gmail.com" style={{ color: "rgb(5,223,114)", marginRight: "100px" }}>
              Gatherly@gmail.com
            </a>
            <span style={{ color: "gray" }}>[enter info]</span>
          </div>

          <div style={{ fontSize: "10px" }}>
            <a href="tel:012-345-6789" style={{ color: "rgb(5,223,114)", marginRight: "128px" }}>
              012-345-6789
            </a>
            <span style={{ color: "gray" }}>[enter info]</span>
          </div>

          <div style={{ fontSize: "10px" }}>
            <a href="[enter info]" style={{ color: "rgb(5,223,114)", marginRight: "142px", fontSize: "10px" }}>
              [enter info]
            </a>
            <span style={{ color: "gray", fontSize: "10px" }}> [enter info]</span>
          </div>

          <div className="w-full p-4 text-center text-sm text-green-400 bg-black border-t border-green-900 mt-10">
            © {year} Gatherly. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}

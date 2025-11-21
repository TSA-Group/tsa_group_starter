
"use client";

import React, { useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const year = new Date().getFullYear();

  // Reference for the hero box so we can track its scroll progress relative to viewport
  const boxRef = useRef(null);

  // Use framer-motion's useScroll to get a progress value (0 -> 1) for the box
  // Offsets chosen so the animation begins when the box is mostly in view and finishes as it leaves
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });

  // Translate X from 0% (centered) to -40% (move left) as the user scrolls
  // You can tweak "-40%" to a larger negative value for more dramatic left-translate.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  // Slight scale for depth while moving left (optional)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return (
    <>
      <Head>
        <title>Gatherly — Home</title>
        <meta name="description" content="Gatherly — Personal Geolocation Data Assembler" />
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap" rel="stylesheet" />
      </Head>

      {/* Animated Sticky Header (keeps existing Header component) */}
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
        {/* Hero wrapper — give vertical space so scroll effect is obvious on smaller screens */}
        <div className="w-full max-w-6xl px-6 py-20 flex justify-center">
          {/* Motion box: starts centered (mx-auto), moves left as scrollYProgress increases */}
          <motion.div
            ref={boxRef}
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
          </motion.div>
        </div>

        {/* Add some content below so page is scrollable and the left-move is visible */}
        <div className="w-full max-w-4xl px-6 py-12 text-green-200 space-y-6">
          <div className="h-96 bg-black/40 rounded-lg border border-green-900" />
          <div className="h-96 bg-black/40 rounded-lg border border-green-900" />
          <div className="h-96 bg-black/40 rounded-lg border border-green-900" />
        </div>

        {/* Footers */}

        <footer className="w-full p-4 text-left text-sm text-green-400 bg-black border-t border-green-900 mt-4">
          <p
            
            className="underline hover:text-green-400"
            style={{ color: "rgb(5,223,114)", fontSize: "14px" }}
          >
            <b>Contact Our Wonderful Community Staff At:</b>
            
          </p>
          <div style={{ fontSize: "10px" }}>
            <a
              href="mailto:Gatherly@gmail.com"
              style={{ color: "rgb(5,223,114)", marginRight: "100px" }}
            >
              Gatherly@gmail.com
            </a>
              <span style={{ color: "gray" }}>[enter info]</span>
          </div>
          <div style={{ fontSize: "10px" }}>
            <a
              href="tel:012-345-6789"
              style={{ color: "rgb(5,223,114)", marginRight: "128px" }}
            >
              012-345-6789
            </a>
              <span style={{ color: "gray" }}>[enter info]</span>
          </div>
          <div style={{ fontSize: "10px" }}>
            <a
              href="[enter info]"
              style={{ color: "rgb(5,223,114)", marginRight: "142px", fontSize: "10px" }}
            >
              [enter info]
            </a>
              <span style={{ color: "gray", fontSize: "10px" }}> [enter info]</span>
          </div>
          <footer className="w-full p-4 text-center text-sm text-green-400 bg-black border-t border-green-900 mt-10">
          © {year} Gatherly. All rights reserved.
        </footer>
        </footer>
      </div>
    </>
  );
}

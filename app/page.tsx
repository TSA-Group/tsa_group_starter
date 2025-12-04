"use client";

import React, { useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle"; 

export default function Home() {
  const year = new Date().getFullYear();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });

  const yBox = useTransform(scrollYProgress, [0, 1], [150, 0]);

  return (
    <>
      <Head>
        <title>Gatherly — Home</title>
        <meta name="description" content="Gatherly — Community Resource Hub" />
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </Head>

      
      
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-[#121212] backdrop-blur-xl shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#37474F] dark:text-[#ECEFF1]">
          Gatherly
        </h1>
        <ThemeToggle /> 
      </header>

      
      <div className="pt-24 min-h-screen flex flex-col items-center bg-[#F4F6F7] dark:bg-[#121212] font-sans text-[#37474F] dark:text-[#ECEFF1]">
        
        
        <div className="w-full max-w-6xl px-6 mt-6 flex flex-col lg:flex-row gap-10 items-start">
          
          
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 border-l-4 border-[#26A69A] bg-white dark:bg-[#1E1E1E] p-10 rounded-xl shadow-xl"
          >
            <h2
              className="text-5xl font-bold leading-snug tracking-tight mb-6 text-[#37474F] dark:text-[#ECEFF1]"
              style={{ fontFamily: "Momo Signature, sans-serif" }}
            >
              Community Resource Hub
            </h2>

            <p className="text-lg leading-relaxed mb-8 text-[#546E7A] dark:text-[#B0BEC5]">
              Explore local nonprofits, events, support services, and helpful community programs—
              all organized in one central place.
            </p>

            <Link
              href="/map"
              className="inline-block rounded-full bg-[#26A69A] px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-[#1F8D81]"
            >
              Launch Maps
            </Link>
          </motion.div>

          
          <motion.div
            ref={boxRef}
            className="w-full lg:w-1/2 h-[450px] rounded-lg border border-[#90A4AE] bg-white/70 dark:bg-[#1E1E1E] shadow"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            style={{ y: yBox as unknown as number }}
          />
        </div>

        
        <footer className="w-full p-4 text-left text-sm text-[#37474F] dark:text-[#ECEFF1] bg-white dark:bg-[#1E1E1E] border-t border-[#B0BEC5] dark:border-[#37474F] mt-4">
          <p className="underline hover:text-[#26A69A]">
            <b>Contact Our Community Staff:</b>
          </p>
          <div style={{ fontSize: "12px" }}>
            <a href="mailto:Gatherly@gmail.com" className="text-black dark:text-[#ECEFF1] mr-10">
              Gatherly@gmail.com
            </a>
          </div>
          <div style={{ fontSize: "12px" }}>
            <a href="tel:012-345-6789" className="text-black dark:text-[#ECEFF1] mr-12">
              012-345-6789
            </a>
          </div>
          <div style={{ fontSize: "12px" }}>
            <a href="#" className="text-black dark:text-[#ECEFF1] mr-12">
              [enter info]
            </a>
          </div>
        </footer>

        <footer className="w-full p-4 text-center text-sm text-[#607D8B] dark:text-[#B0BEC5] bg-white dark:bg-[#1E1E1E] border-t border-[#B0BEC5] dark:border-[#37474F] mt-10">
          © {year} Gatherly. All rights reserved.
        </footer>
      </div>
    </>
  );
}

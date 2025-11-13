import Head from "next/head";
import React from 'react';
import Link from "next/link";
import Header from "./components/Header";
export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/tan-buster"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap" 
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col bg-black font-sans">
        {/* Header with Gatherly */}
        <header className="w-full flex items-start p-8 bg-black">
          <nav>
        <ul className="flex space-x-10 text-lg font-medium">
        <>
      <Header />
    </>

        </ul>
      </nav>
          
        
        </header>

        {/* Main content fills all available space */}
        <main className="flex-grow w-full p-8 text-green-200 flex flex-col items-start">
          <h2 className="text-5xl font-semibold leading-snug tracking-tight mb-6 text-green-400">
            Your Personal Geolocation Data Assembler
          </h2>
          <p className="text-lg leading-relaxed max-w-4xl mb-8 text-green-200">
            Gatherly helps you find, organize, and visualize nearby locations
            with precision. Explore local data, discover insights, and connect
            your maps like never before.
          </p>

          <a
            href="/map"
            className="inline-block rounded-full bg-green-600 px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700 mb-6"
          >
            Launch Maps
          </a>
              


        </main>

        {/* Footer aligned bottom with muted text */}
        <footer className="w-full p-4 text-center text-sm text-green-800 bg-black">
          © {new Date().getFullYear()} Gatherly. All rights reserved.
        </footer>
      </div>
    </>
  );
}

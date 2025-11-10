import Head from "next/head";
import React from 'react';
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
          <h1
            className="text-green-400 text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: "'Tan Buster', sans-serif",
            }}
          >
            Gatherly
          </h1>
        
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
               import React, { useEffect, useRef } from "react";

const GoogleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (mapRef.current) {
        new google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12,
        });
      }
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMap;


        </main>

        {/* Footer aligned bottom with muted text */}
        <footer className="w-full p-4 text-center text-sm text-green-800 bg-black">
          © {new Date().getFullYear()} Gatherly. All rights reserved.
        </footer>
      </div>
    </>
  );
}


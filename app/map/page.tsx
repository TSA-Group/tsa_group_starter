"use client";

import { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

export default function Page() {
  const [position, setPosition] = useState({ lat: 53.54, lng: 10 });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (
      initializedRef.current ||
      !window.google?.maps?.places ||
      !inputRef.current
    )
      return;

    initializedRef.current = true;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment"],
        fields: ["geometry"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        const loc = place.geometry.location;
        setPosition({ lat: loc.lat(), lng: loc.lng() });
      }
    });
  }, []);

  return (
    <APIProvider
      apiKey="AIzaSyA1o7Vio2dHZqCPqC4suZ1cJMPg79G2XFc"
      libraries={["places"]}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#111", height: "100vh", padding: "2rem", gap: "1rem" }}>
        <div style={{ height: "400px", width: "100%", maxWidth: "800px", borderRadius: "20px", boxShadow: "0 0 20px rgba(0, 255, 255, 0.6)", overflow: "hidden" }}>
          <Map zoom={12} center={position} style={{ height: "100%", width: "100%" }}>
            <AdvancedMarker position={position} />
          </Map>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a place..."
          style={{
            width: "100%",
            maxWidth: "800px",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "none",
            fontSize: "1rem",
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.4)",
            backgroundColor: "#222",
            color: "#0ff",
          }}
        />
      </div>
    </APIProvider>
  );
}

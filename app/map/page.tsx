"use client";

import { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function Page() {
  const [position, setPosition] = useState({ lat: 53.54, lng: 10 });
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment"], // or use ["geocode"] for addresses
        fields: ["geometry"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const loc = place.geometry.location;
        setPosition({ lat: loc.lat(), lng: loc.lng() });
      }
    });
  }, []);

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.6)",
    overflow: "hidden",
  };

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111",
    padding: "2rem",
    gap: "1rem",
  };

  const inputStyle = {
    width: "100%",
    maxWidth: "600px",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    boxShadow: "0 0 10px rgba(0, 255, 255, 0.4)",
  };

  return (
    <APIProvider apiKey={"AIzaSyCvg7nk61C3TUhEQlPjbAqpyfJA9OVjC08"}>
      <div style={wrapperStyle}>
        <div style={mapContainerStyle}>
          <Map zoom={12} center={position} style={{ height: "100%", width: "100%" }} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a place..."
          style={inputStyle}
        />
      </div>
    </APIProvider>
  );
}

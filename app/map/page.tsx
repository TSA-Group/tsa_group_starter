"use client";

import { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function MapWithAutocompleteDropdown() {
  const [position, setPosition] = useState({ lat: 53.54, lng: 10 });
  const [placeName, setPlaceName] = useState("");
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

    // Create autocomplete instance for the input
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        fields: ["geometry", "name"],
      }
    );

    // Listener for place selection (add this block)
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      console.log(place); // Optional: for debugging
      if (place?.geometry?.location) {
        const loc = place.geometry.location;
        setPosition({ lat: loc.lat(), lng: loc.lng() });
        setPlaceName(place.name || inputRef.current?.value || "");
      } else {
        alert("Selected place does not have a valid location. Try again.");
      }
    });
  }, []);

  const MAP_ID = "8859a83a13a834f62d11ad10"; // Replace with your actual Map ID
  const API_KEY = "AIzaSyA1o7Vio2dHZqCPqC4suZ1cJMPg79G2XFc"; // Replace with your actual API key

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111",
    padding: "2rem",
    gap: "1rem",
  };

  const mapContainerStyle: React.CSSProperties = {
    height: "400px",
    width: "100%",
    maxWidth: "800px",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0, 255, 0, 0.6)",
    position: "relative", // Ensure the map stacks below the input
    zIndex: 1,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "800px",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    boxShadow: "0 0 10px rgba(0, 255, 0, 0.4)",
    backgroundColor: "#222",
    color: "rgba(0, 255, 0, 0.6)",
    zIndex: 2, // Ensure it's above map controls
    position: "relative",
  };

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div style={wrapperStyle}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for an address..."
          style={inputStyle}
        />
        <div style={mapContainerStyle}>
          <Map
            zoom={12}
            center={position}
            mapId={MAP_ID}
            style={{ height: "100%", width: "100%" }}
          >
            <AdvancedMarker position={position}>
              {placeName && (
                <InfoWindow position={position}>
                  <div style={{ color: "#000", fontWeight: "bold" }}>
                    {placeName}
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}

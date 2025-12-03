"use client";

import { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

export default function MapWithSearch() {
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

  const MAP_ID = "8859a83a13a834f62d11ad10"; // Replace with your actual Map ID

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#FFFFFF",
    padding: "3rem 2rem 6rem",
    gap: "1rem",
  };

  const mapContainerStyle: React.CSSProperties = {
    height: "400px",
    width: "100%",
    maxWidth: "800px",
    borderRadius: "20px",
    border: "2px solid #ADD8E6",
    boxShadow: "0 0 20px rgba(173, 216, 230, 5)",
    overflow: "hidden",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "800px",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "2px solid #ADD8E6",
    fontSize: "1rem",
    boxShadow: "0 0 15px rgba(173, 216, 230, 5)",
    backgroundColor: "#D3D3D3",
    color: "rgba(0,0,0,0.6)",
  };

  return (
    <APIProvider
      apiKey="AIzaSyDzK6PTB7zsDG9ITehC9-F98UZlzgg2AEw" // Replace with your actual API key
      libraries={["places"]}
    >
      <div style={wrapperStyle}>
        <div style={mapContainerStyle}>
          <Map
            zoom={12}
            center={position}
            mapId={MAP_ID}
            style={{ height: "100%", width: "100%" }}
          >
            <AdvancedMarker position={position} />
          </Map>
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

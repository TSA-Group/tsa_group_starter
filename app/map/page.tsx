"use client";

import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function Page() {
  const position = { lat: 53.54, lng: 10 };

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.6)", // glowing effect
    overflow: "hidden",
  };

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#111", // dark background to enhance glow
    padding: "2rem",
  };

  return (
    <APIProvider apiKey={"AIzaSyCvg7nk61C3TUhEQlPjbAqpyfJA9OVjC08"}>
      <div style={wrapperStyle}>
        <div style={mapContainerStyle}>
          <Map zoom={9} center={position} style={{ height: "100%", width: "100%" }} />
        </div>
      </div>
    </APIProvider>
  );
}

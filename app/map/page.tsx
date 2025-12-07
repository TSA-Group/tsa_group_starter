"use client";

import { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

interface LatLng {
  lat: number;
  lng: number;
}

export default function Page() {
  const [center, setCenter] = useState<LatLng>({
    lat: 37.7749,
    lng: -122.4194,
  }); // Default: San Francisco
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          gap: "1rem",
          background: "#fff",
        }}
      >
        {/* MAP CONTAINER */}
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            borderRadius: "16px",
            border: "2px solid #ADD8E6",
            overflow: "hidden",
          }}
        >
          <Map
            defaultZoom={12}
            center={center}
            mapId="8859a83a13a834f62d11ad10"
          >
            {selectedPlace && <Marker position={selectedPlace} />}
          </Map>
        </div>

        {/* SEARCH BOX BELOW MAP */}
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <SearchBox
            input={input}
            setInput={setInput}
            predictions={predictions}
            setPredictions={setPredictions}
            setCenter={setCenter}
            setSelectedPlace={setSelectedPlace}
          />
        </div>
      </div>
    </APIProvider>
  );
}

interface SearchBoxProps {
  input: string;
  setInput: (val: string) => void;
  predictions: google.maps.places.AutocompletePrediction[];
  setPredictions: (preds: google.maps.places.AutocompletePrediction[]) => void;
  setCenter: (loc: LatLng) => void;
  setSelectedPlace: (loc: LatLng | null) => void;
}

function SearchBox({
  input,
  setInput,
  predictions,
  setPredictions,
  setCenter,
  setSelectedPlace,
}: SearchBoxProps) {
  const placesLib = useMapsLibrary("places");
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  // Initialize AutocompleteService once
  useEffect(() => {
    if (!placesLib) return;
    serviceRef.current = new placesLib.AutocompleteService();
  }, [placesLib]);

  // Fetch predictions when input changes
  useEffect(() => {
    if (!serviceRef.current || !input) {
      setPredictions([]);
      return;
    }
    serviceRef.current.getPlacePredictions({ input }, (res) => {
      setPredictions(res || []);
    });
  }, [input, setPredictions]);

  const handleSelect = (placeId: string) => {
    if (!placesLib) return;
    const detailsService = new placesLib.PlacesService(
      document.createElement("div")
    );
    detailsService.getDetails({ placeId }, (place) => {
      if (place?.geometry?.location) {
        const loc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(loc);
        setSelectedPlace(loc);
        setInput(place.formatted_address || "");

        // ✅ Clear predictions after selection
        setTimeout(() => {
          setPredictions([]);
        }, 0);
      }
    });
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a place..."
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {predictions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0" }}>
          {predictions.slice(0, 3).map((p) => (
            <li
              key={p.place_id}
              onClick={() => handleSelect(p.place_id)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
  });
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  // 👇 Track theme safely (no document access at init)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Read current theme from <html data-theme="...">
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");

    const handler = (e: Event) => {
      const custom = e as CustomEvent<"light" | "dark">;
      setTheme(custom.detail);
    };
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  // Replace with your actual Map IDs from Google Cloud
  const lightMapId = "8859a83a13a834f62d11ad10";
  const darkMapId = "8859a83a13a834f6b6b81e80";

  return (
    <APIProvider
      apiKey="AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM"
      libraries={["places"]}
    >
      <div className="flex flex-col items-center min-h-screen gap-4 bg-base-100 text-base-content">
        <div className="w-full max-w-3xl h-[400px] rounded-xl border-2 border-primary overflow-hidden">
          <Map
            defaultZoom={12}
            center={center}
            mapId={theme === "dark" ? darkMapId : lightMapId}
          >
            {selectedPlace && <Marker position={selectedPlace} />}
          </Map>
        </div>

        <div className="w-full max-w-3xl">
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

function SearchBox({
  input,
  setInput,
  predictions,
  setPredictions,
  setCenter,
  setSelectedPlace,
}: {
  input: string;
  setInput: (val: string) => void;
  predictions: google.maps.places.AutocompletePrediction[];
  setPredictions: (preds: google.maps.places.AutocompletePrediction[]) => void;
  setCenter: (loc: LatLng) => void;
  setSelectedPlace: (loc: LatLng | null) => void;
}) {
  const placesLib = useMapsLibrary("places");
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );

  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new placesLib.AutocompleteService();
    }
  }, [placesLib]);

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
    // Safe: document.createElement only runs client-side
    const detailsService = new placesLib.PlacesService(
      document.createElement("div"),
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
        setTimeout(() => setPredictions([]), 0);
      }
    });
  };

  return (
    <div className="p-3 bg-base-200 rounded-lg shadow-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a place..."
        className="w-full p-2 border border-base-300 rounded-md bg-base-100 text-base-content"
      />
      {predictions.length > 0 && (
        <ul className="list-none mt-2 p-0">
          {predictions.slice(0, 3).map((p) => (
            <li
              key={p.place_id}
              onClick={() => handleSelect(p.place_id)}
              className="p-2 cursor-pointer border-b border-base-300 hover:bg-base-300"
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";
import { motion, AnimatePresence } from "framer-motion";

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

  // 👇 Track theme safely
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");

    const handler = (e: Event) => {
      const custom = e as CustomEvent<"light" | "dark">;
      setTheme(custom.detail);
    };
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  // 👇 Google’s official Night Mode style JSON
  const darkStyle: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212121" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8a8a8a" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3d3d3d" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#181818" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1b1b1b" }],
    },
  ];

  return (
    <APIProvider
      apiKey="AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM"
      libraries={["places"]}
    >
      <div className="flex flex-col items-center min-h-screen gap-4 bg-base-100 text-base-content">
        <div className="w-full max-w-3xl h-[400px] rounded-xl border-2 border-primary overflow-hidden">
          {/* 👇 key={theme} forces remount when theme changes */}
          <Map
            key={theme}
            defaultZoom={12}
            center={center}
            mapTypeId="roadmap"
            // 👇 inject style JSON directly
            styles={theme === "dark" ? darkStyle : []}
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
  const boxRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new placesLib.AutocompleteService();
    }
  }, [placesLib]);

  useEffect(() => {
    if (!serviceRef.current || !input || !open) {
      setPredictions([]);
      return;
    }

    serviceRef.current.getPlacePredictions({ input }, (res) => {
      setPredictions(res || []);
    });
  }, [input, open, setPredictions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (placeId: string) => {
    if (!placesLib) return;

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

        setOpen(false);
        setPredictions([]);
      }
    });
  };

  return (
    <div ref={boxRef} className="p-3 bg-base-200 rounded-lg shadow-md">
      {/* 👇 positioning wrapper (NO padding) */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          placeholder="Search for a place..."
          className="
            w-full
            p-2 pr-12
            border border-base-300 rounded-md
            bg-base-100 text-base-content
          "
        />

        {input.trim().length > 0 && (
          <motion.button
            type="button"
            aria-label="Show results"
            onClick={() => {
              setOpen(false);
              setPredictions([]);
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              w-9 h-9
              flex items-center justify-center
              rounded-full
              bg-blue-600 text-white
              shadow-md
            "
          >
            →
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {open && predictions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="
              absolute left-0
              w-full max-w-full
              mt-3
              bg-base-100
              border border-base-300
              rounded-md
              overflow-hidden
              shadow-lg
              z-20
            "
          >
            {predictions.slice(0, 3).map((p, idx) => (
              <li
                key={p.place_id}
                onClick={() => handleSelect(p.place_id)}
                className={`
                    p-3 cursor-pointer transition-colors
                    hover:bg-base-300
                    ${idx !== 0 ? "border-t border-base-300" : ""}
                  `}
              >
                {p.description}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

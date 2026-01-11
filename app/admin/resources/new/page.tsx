"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import AdminShell from "../../_components/AdminShell";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, type Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

/** ---------------- Motion ---------------- */
const sectionAnim: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** ---------------- Admin UI Options ---------------- */
const COMMUNITIES = ["Cross Creek Ranch"] as const;

const RESOURCE_TYPES = [
  "Gym/Fitness",
  "Park/Trails",
  "Grocery",
  "Library",
  "Support Services",
  "Non-Profit",
  "Clinic/Health",
  "Other",
] as const;

/** ---------------- Map schema types (must match app/map/page.tsx) ---------------- */
type LatLng = { lat: number; lng: number };

type EventType =
  | "Community Event"
  | "Park & Trails"
  | "Fitness"
  | "Grocery"
  | "Library"
  | "Support Services"
  | "Food Pantry"
  | "Volunteer Opportunity"
  | "Other";

type ActivityType =
  | "Family"
  | "Outdoors"
  | "Food"
  | "Education"
  | "Health"
  | "Support"
  | "Volunteering"
  | "Shopping";

/** ---------------- Your original admin doc type (kept) ---------------- */
export type ResourceDoc = {
  community: (typeof COMMUNITIES)[number];
  types: (typeof RESOURCE_TYPES)[number][];
  name: string;
  address: string;
  indoorOutdoor: "Indoor" | "Outdoor" | "Both";
  contact: string;
  location?: { lat: number; lng: number } | null;
  createdAt: Timestamp | null;
};

/** ---------------- Helpers ---------------- */
function pickEventType(types: (typeof RESOURCE_TYPES)[number][]): EventType {
  // choose a single main category for the map cards/labels
  if (types.includes("Park/Trails")) return "Park & Trails";
  if (types.includes("Gym/Fitness")) return "Fitness";
  if (types.includes("Grocery")) return "Grocery";
  if (types.includes("Library")) return "Library";
  if (types.includes("Support Services")) return "Support Services";
  if (types.includes("Clinic/Health")) return "Support Services"; // closest match in your map types
  if (types.includes("Non-Profit")) return "Volunteer Opportunity";
  return "Other";
}

function pickActivities(types: (typeof RESOURCE_TYPES)[number][]): ActivityType[] {
  const set = new Set<ActivityType>();

  if (types.includes("Park/Trails")) {
    set.add("Outdoors");
    set.add("Family");
  }
  if (types.includes("Gym/Fitness") || types.includes("Clinic/Health")) {
    set.add("Health");
  }
  if (types.includes("Grocery")) {
    set.add("Shopping");
    set.add("Food");
  }
  if (types.includes("Library")) {
    set.add("Education");
    set.add("Family");
  }
  if (types.includes("Support Services") || types.includes("Clinic/Health")) {
    set.add("Support");
  }
  if (types.includes("Non-Profit")) {
    set.add("Volunteering");
    set.add("Support");
  }

  // fallback
  if (set.size === 0) set.add("Family");

  return Array.from(set);
}

async function geocodeAddress(address: string, apiKey: string): Promise<LatLng> {
  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(address)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed.");
  const json = await res.json();

  const loc = json?.results?.[0]?.geometry?.location;
  const lat = Number(loc?.lat);
  const lng = Number(loc?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Could not find a valid lat/lng for that address.");
  }

  return { lat, lng };
}

/** ---------------- Page ---------------- */
export default function AddResourcePage() {
  const router = useRouter();

  // ✅ Put this in .env.local and Vercel env:
  // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxxx
  const MAPS_KEY = "AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM";

  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [community, setCommunity] = React.useState<(typeof COMMUNITIES)[number]>("Cross Creek Ranch");

  const [types, setTypes] = React.useState<(typeof RESOURCE_TYPES)[number][]>(["Park/Trails"]);
  const [typesOpen, setTypesOpen] = React.useState(false);
  const typesRef = React.useRef<HTMLDivElement | null>(null);

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [indoorOutdoor, setIndoorOutdoor] = React.useState<"Indoor" | "Outdoor" | "Both">("Both");
  const [contact, setContact] = React.useState("");

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!typesRef.current) return;
      if (!typesRef.current.contains(e.target as Node)) setTypesOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggleType = (t: (typeof RESOURCE_TYPES)[number]) => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const logoutAndHome = () => {
    localStorage.removeItem("admin_authed");
    router.push("/");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !address.trim()) {
      setError("Please fill out Resource Name and Address.");
      return;
    }
    if (types.length === 0) {
      setError("Please select at least 1 Resource Type.");
      return;
    }
    if (!MAPS_KEY) {
      setError("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Add it to .env.local and Vercel env vars.");
      return;
    }

    try {
      setSaving(true);

      // ✅ Get coordinates so your MAP/Resources tab can place a marker
      const position = await geocodeAddress(address.trim(), MAPS_KEY);

      // ✅ Derive the fields that app/map/page.tsx expects
      const eventType = pickEventType(types);
      const activities = pickActivities(types);

      await addDoc(collection(db, "resources"), {
        // ----------------
        // Keep your existing admin fields (so you don't “change the database”)
        community,
        types,
        name: name.trim(),
        address: address.trim(),
        indoorOutdoor,
        contact: contact.trim(),
        location: position,            // no longer null (still your field)
        createdAt: serverTimestamp(),

        // ----------------
        // ALSO write the map/resources-tab schema fields
        title: name.trim(),            // map expects "title"
        position,                      // map expects "position"
        eventType,                     // map expects "eventType"
        activities,                    // map expects "activities"

        // optional extras your map code supports
        host: community,
        description: contact.trim() ? `Contact: ${contact.trim()}` : undefined,
        featured: false,
      });

      setSent(true);
      window.setTimeout(() => setSent(false), 2200);

      setName("");
      setAddress("");
      setContact("");
      setIndoorOutdoor("Both");
      setTypes(["Park/Trails"]);
    } catch (err: any) {
      setError(err?.message || "Failed to save resource. Check Firestore rules + API key restrictions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Add Resource"
      subtitle="Resources are places/services that exist (gym, parks, grocery stores, support services)."
    >
      <div className="mb-4">
        <motion.button
          onClick={logoutAndHome}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
        >
          <span aria-hidden>←</span>
          Back to Home
        </motion.button>
      </div>

      <motion.div variants={sectionAnim} initial="hidden" animate="show">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="text-white/80 font-semibold">Subsections</div>
            <div className="mt-2 text-sm text-white/60">
              Community Name (dropdown) → Resources (types, name, address, indoor/outdoor, contact)
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.25 } }}
                    exit={{ opacity: 0, y: -6, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.2 } }}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                  >
                    ✅ Resource saved to Firestore!
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.25 } }}
                    exit={{ opacity: 0, y: -6, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.2 } }}
                    className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    ❌ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Community */}
            <Field label="Community Name">
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value as (typeof COMMUNITIES)[number])}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {COMMUNITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0b1020]">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            {/* Types */}
            <Field label="Resource Types (multi-select)">
              <div ref={typesRef} className="relative">
                <button
                  type="button"
                  onClick={() => setTypesOpen((v) => !v)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      {types.length === 0 ? (
                        <span className="text-white/50">Select types…</span>
                      ) : (
                        <span className="text-white">{types.join(", ")}</span>
                      )}
                    </div>
                    <span className="text-white/60">{typesOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {typesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                      exit={{ opacity: 0, y: 6, filter: "blur(6px)", transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } }}
                      className="absolute z-20 mt-2 w-full rounded-2xl border border-white/10 bg-[#070A12]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-2"
                    >
                      <div className="max-h-56 overflow-auto">
                        {RESOURCE_TYPES.map((t) => {
                          const checked = types.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleType(t)}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition text-left"
                            >
                              <span className="text-sm text-white/90">{t}</span>
                              <span
                                className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs ${
                                  checked
                                    ? "border-blue-400/40 bg-blue-500/20 text-white"
                                    : "border-white/15 bg-white/5 text-white/40"
                                }`}
                              >
                                {checked ? "✓" : ""}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 mt-2">
                        <button
                          type="button"
                          onClick={() => setTypes([])}
                          className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setTypesOpen(false)}
                          className="text-xs px-3 py-2 rounded-xl bg-blue-600/90 text-white hover:bg-blue-600 transition"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Field>

            {/* Name */}
            <Field label="Resource Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Example: Cross Creek Ranch Fitness Center"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            {/* Indoor/Outdoor */}
            <Field label="Indoor / Outdoor">
              <div className="grid grid-cols-3 gap-2">
                {(["Indoor", "Outdoor", "Both"] as const).map((opt) => {
                  const active = indoorOutdoor === opt;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setIndoorOutdoor(opt)}
                      className={`rounded-2xl px-3 py-3 text-sm border transition ${
                        active
                          ? "border-blue-500/40 bg-blue-500/15 text-white"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </Field>

            {/* Address */}
            <div className="md:col-span-2">
              <Field label="Address">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Street address (recommended) or landmark"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
              <div className="mt-2 text-xs text-white/55">
                Note: we geocode the address to create map markers.
              </div>
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <Field label="Contact">
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone / email / website (optional)"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-3 flex-wrap pt-2">
              <div className="text-xs text-white/55">
                Saves directly to Firestore collection: <span className="font-semibold">resources</span>
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={saving}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-[0_20px_55px_rgba(37,99,235,0.25)] hover:brightness-110 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Resource"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-white/85">{label}</div>
      {children}
    </div>
  );
}

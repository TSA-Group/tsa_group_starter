Add Resources

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminShell from "../../_components/AdminShell";

const sectionAnim = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

const COMMUNITIES = ["Cross Creek Ranch", "Cross Creek West", "Cross Creek"] as const;
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

export default function AddResourcePage() {
  const [sent, setSent] = React.useState(false);

  const [community, setCommunity] = React.useState<(typeof COMMUNITIES)[number]>("Cross Creek");
  const [type, setType] = React.useState<(typeof RESOURCE_TYPES)[number]>("Park/Trails");
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [indoorOutdoor, setIndoorOutdoor] = React.useState<"Indoor" | "Outdoor" | "Both">("Both");
  const [contact, setContact] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // demo submit
    setSent(true);
    setTimeout(() => setSent(false), 2200);

    // reset
    setName("");
    setAddress("");
    setContact("");
    setIndoorOutdoor("Both");
    setType("Park/Trails");
  };

  return (
    <AdminShell
      title="Add Resource"
      subtitle="Resources are places/services that exist (gym, parks, grocery stores, support services)."
    >
      <motion.div variants={sectionAnim} initial="hidden" animate="show">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="text-white/80 font-semibold">
              Subsections
            </div>
            <div className="mt-2 text-sm text-white/60">
              Community Name (dropdown) → Resources (type, name, address, indoor/outdoor, contact)
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                  >
                    ✅ Resource submitted (demo). Hook this to your DB later.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Community */}
            <Field label="Community Name">
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value as any)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {COMMUNITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0b1020]">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            {/* Resource Type */}
            <Field label="Resource Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0b1020]">
                    {t}
                  </option>
                ))}
              </select>
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
                      className={`rounded-2xl px-3 py-3 text-sm border transition
                        ${
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
                  placeholder="Street / area / landmark in Fulshear / Cross Creek"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
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
                This is a demo submit. Later connect to DB (POST request).
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-[0_20px_55px_rgba(37,99,235,0.25)] hover:brightness-110 transition"
              >
                Save Resource
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

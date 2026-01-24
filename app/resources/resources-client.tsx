"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { collection, onSnapshot, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ResourceDoc = {
  name?: string;
  address?: string;
  community?: string;
  contact?: string;
  indoorOutdoor?: "Indoor" | "Outdoor" | "Both" | string;
  types?: string[];
  createdAt?: Timestamp | any;
  description?: string;
};

type ResourceUI = {
  id: string;
  name: string;
  address: string;
  community: string;
  contact?: string;
  indoorOutdoor?: string;
  types: string[];
  description?: string;
  createdAtMs: number;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function safeStr(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function safeArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

function toMs(createdAt: any) {
  return (
    createdAt?.toMillis?.() ??
    (typeof createdAt?.seconds === "number" ? createdAt.seconds * 1000 : 0)
  );
}

export default function ResourcesClient() {
  const [rows, setRows] = useState<ResourceUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [activeType, setActiveType] = useState<string>("All");

  useEffect(() => {
    setLoading(true);
    setErrMsg(null);

    const ref = collection(db, "resources");
    console.log("FIREBASE PROJECT:", (db as any)?._databaseId?.projectId);


    const unsub = onSnapshot(
      ref,
      (snap) => {
        const next: ResourceUI[] = snap.docs.map((d) => {
          const data = d.data() as ResourceDoc;
          const types = safeArr(data.types);

          return {
            id: d.id,
            name: safeStr(data.name, "Untitled resource"),
            address: safeStr(data.address, ""),
            community: safeStr(data.community, ""),
            contact: safeStr(data.contact, ""),
            indoorOutdoor: safeStr(data.indoorOutdoor, ""),
            types,
            description: safeStr(data.description, ""),
            createdAtMs: toMs(data.createdAt),
          };
        });

        next.sort((a, b) => b.createdAtMs - a.createdAtMs);

        setRows(next);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to read resources:", err);
        setErrMsg(err?.message || "Failed to read resources.");
        setRows([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const allTypes = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.types.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return rows.filter((r) => {
      const typePass = activeType === "All" || r.types.includes(activeType);
      if (!needle) return typePass;

      const hay = [
        r.name,
        r.address,
        r.community,
        r.contact ?? "",
        r.indoorOutdoor ?? "",
        ...r.types,
        r.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return typePass && hay.includes(needle);
    });
  }, [rows, q, activeType]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10"
      >
        <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A]">
                Resources
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Community resources saved by admins (live from Firestore).
              </p>
            </div>

            <AnimatePresence>
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-900"
                >
                  Showing {filtered.length} resource
                  {filtered.length === 1 ? "" : "s"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {errMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              ❌ {errMsg}
              <div className="mt-1 text-xs text-rose-800">
                This usually means Firestore rules blocked read access OR your
                app is pointing to a different Firebase project than the Admin
                page.
              </div>
            </div>
          )}
        </motion.div>

        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm p-4 sm:p-5 mb-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {allTypes.map((t) => {
                const active = activeType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-2 rounded-full border text-sm transition ${
                      active
                        ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                        : "border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resources…"
              className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-slate-900
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </motion.section>
        <motion.section
          variants={fadeUp}
          className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm p-4 sm:p-5"
        >
          {loading ? (
            <div className="rounded-2xl border border-blue-200 bg-white p-5 text-slate-700">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-blue-200 bg-white p-5 text-slate-700">
              No resources found. Add one in Admin → “Add Resource”.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-blue-900">
                    {r.types[0] ?? "Resource"}
                  </div>

                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {r.name}
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    {r.address || "No address provided"}
                  </div>

                  {r.description ? (
                    <div className="mt-3 text-sm text-slate-700">
                      {r.description}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.types.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full border border-blue-200 text-blue-900 bg-blue-50"
                      >
                        {t}
                      </span>
                    ))}

                    {r.indoorOutdoor ? (
                      <span className="text-xs px-2 py-1 rounded-full border border-blue-200 text-blue-900 bg-blue-50">
                        {r.indoorOutdoor}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
}

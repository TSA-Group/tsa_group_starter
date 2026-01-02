"use client";

import Head from "next/head";
import { useMemo, useState } from "react";
import RegisterClient, { EventItem } from "./register";

type Category = { id: string; name: string };
type Activity = { id: string; name: string };
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
    {children}
  </span>
);

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "popular">("upcoming");

  // NEW: state for currently registering event
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "community", name: "Community Dinner" },
    { id: "meetup", name: "Neighborhood Meetup" },
    { id: "clothing", name: "Clothing Drive" },
    { id: "tutoring", name: "Literacy Tutoring" },
    { id: "pantry", name: "Food Pantry" },
    { id: "cleanup", name: "Volunteer Cleanup" },
  ];

  const activities: Activity[] = [
    { id: "food", name: "Food" },
    { id: "volunteering", name: "Volunteering" },
    { id: "education", name: "Education" },
    { id: "donations", name: "Donations" },
    { id: "outdoors", name: "Outdoors" },
    { id: "family", name: "Family" },
  ];

  const EVENTS: EventItem[] = [
    {
      id: 1,
      title: "Community Dinner Night",
      category: "community",
      activities: ["food", "family"],
      date: "Dec 28, 2025",
      time: "6:00 PM – 8:00 PM",
      location: "Highland Park Community Center",
      attendees: 42,
      spots: 60,
      description:
        "A welcoming dinner bringing neighbors together for conversation and connection.",
    },
    {
      id: 2,
      title: "Literacy Tutoring Session",
      category: "tutoring",
      activities: ["education"],
      date: "Dec 25, 2025",
      time: "4:00 PM – 6:00 PM",
      location: "Westbury Library",
      attendees: 14,
      spots: 20,
      description:
        "Volunteer to help young students improve reading and writing skills.",
    },
    // ... add remaining events
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list =
      selectedCategory === "all"
        ? EVENTS
        : EVENTS.filter((e) => e.category === selectedCategory);

    if (selectedActivities.length > 0) {
      list = list.filter((e) =>
        selectedActivities.every((a) => e.activities.includes(a))
      );
    }

    if (q) {
      list = list.filter((e) =>
        `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(q)
      );
    }

    if (sortBy === "popular") {
      list = [...list].sort((a, b) => b.attendees - a.attendees);
    } else {
      list = [...list].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return list;
  }, [selectedCategory, selectedActivities, query, sortBy]);

  const toggleActivity = (id: string) =>
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white antialiased">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <header className="mb-8">
            <h1 className="text-4xl font-semibold text-indigo-300">
              Gatherly — Community Events
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Discover local volunteering opportunities and community events.
            </p>
          </header>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedCategory === c.id
                      ? "bg-indigo-500 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {activities.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleActivity(a.id)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedActivities.includes(a.id)
                      ? "bg-indigo-500 text-white"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="flex-1 bg-white/5 placeholder:text-slate-400 text-slate-100 px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Sort:</span>
                <div className="inline-flex rounded-full bg-white/10 p-1 border border-white/10">
                  {["upcoming", "popular"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option as "upcoming" | "popular")}
                      className={`px-4 py-1 text-sm rounded-full transition ${
                        sortBy === option
                          ? "bg-indigo-500 text-white"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      {option === "upcoming" ? "Upcoming" : "Popular"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Events list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((ev) => {
              const percent = Math.round((ev.attendees / ev.spots) * 100);
              const spotsLeft = ev.spots - ev.attendees;

              return (
                <article
                  key={ev.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-indigo-400/40 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold mb-1">{ev.title}</h3>
                  <p className="text-slate-400 text-sm">{ev.location}</p>
                  <p className="text-slate-300 text-sm mt-1">
                    {ev.date} • {ev.time}
                  </p>

                  <p className="text-slate-300 text-sm mt-3">{ev.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {ev.activities.map((a) => (
                      <Chip key={a}>{a}</Chip>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{percent}% filled</span>
                      <span>{spotsLeft} spots left</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => setSelectedEventId(ev.id)}
                      className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
                    >
                      Register
                    </button>

                    <button className="flex-1 bg-transparent border border-white/10 text-slate-200 py-2 rounded-xl hover:bg-white/10">
                      Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Show RegisterClient only if an event is selected */}
          {selectedEventId && (
            <RegisterClient
              events={EVENTS}
              key={selectedEventId} // force re-mount
            />
          )}
        </div>
      </div>
    </>
  );
}

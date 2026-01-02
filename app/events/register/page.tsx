"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RegisterClient, { EventItem } from "./register-client";

type Category = { id: string; name: string };
type Activity = { id: string; name: string };

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "popular">("upcoming");

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
    {
      id: 3,
      title: "Food Pantry Distribution",
      category: "pantry",
      activities: ["food", "donations"],
      date: "Dec 26, 2025",
      time: "9:00 AM – 1:00 PM",
      location: "Houston Food Bank",
      attendees: 88,
      spots: 110,
      description: "Help organize and distribute food to families in need.",
    },
    // Add more events here
  ];

  const toggleActivity = (id: string) =>
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filtered = useMemo(() => {
    let list =
      selectedCategory === "all"
        ? EVENTS
        : EVENTS.filter((e) => e.category === selectedCategory);

    if (selectedActivities.length > 0) {
      list = list.filter((e) =>
        selectedActivities.every((a) => e.activities.includes(a))
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Gatherly — Community Events</h1>
      <p className="text-gray-300 mb-6">
        Browse local volunteering and community opportunities
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              selectedCategory === c.id
                ? "bg-indigo-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
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
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events..."
        className="mb-6 w-full md:w-1/2 px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ev) => {
          const percent = Math.round((ev.attendees / ev.spots) * 100);
          const spotsLeft = ev.spots - ev.attendees;

          return (
            <div
              key={ev.id}
              className="p-4 border rounded-lg bg-gray-800 hover:border-indigo-500 transition"
            >
              <h2 className="text-xl font-semibold">{ev.title}</h2>
              <p className="text-gray-300 text-sm">
                {ev.date} • {ev.time}
              </p>
              <p className="text-gray-300 text-sm">{ev.location}</p>

              <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{percent}% filled</span>
                <span>{spotsLeft} spots left</span>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/events?id=${ev.id}`}
                  className="flex-1 text-center bg-indigo-500 py-2 rounded-xl hover:bg-indigo-600"
                >
                  Register
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Form */}
      <RegisterClient events={EVENTS} />
    </div>
  );
}

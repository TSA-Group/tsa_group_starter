'use client';

import { useMemo, useState } from 'react';

/* =====================
   Types
===================== */
type Category = {
  id: string;
  name: string;
};

type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  spots: number;
  description: string;
  tag?: string;
};

/* =====================
   Small UI pieces
===================== */
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block mr-2 text-indigo-300" aria-hidden>
    {children}
  </span>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/6 text-slate-200">
    {children}
  </span>
);

/* =====================
   Page
===================== */
export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upcoming' | 'popular'>('upcoming');

  const categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'community', name: 'Community' },
    { id: 'education', name: 'Education' },
    { id: 'food', name: 'Food' },
    { id: 'cleanup', name: 'Cleanup' },
    { id: 'tutoring', name: 'Tutoring' },
    { id: 'outdoors', name: 'Outdoors' },
    { id: 'health', name: 'Health' }
  ];

  const events: Event[] = [
    {
      id: 1,
      title: 'Community Dinner Night',
      category: 'community',
      date: 'Dec 28, 2025',
      time: '6:00 PM – 8:00 PM',
      location: 'Highland Park Community Center',
      attendees: 42,
      spots: 60,
      description: 'A welcoming dinner bringing neighbors together for conversation and connection.',
      tag: 'Featured'
    },
    {
      id: 2,
      title: 'Literacy Tutoring Session',
      category: 'education',
      date: 'Dec 25, 2025',
      time: '4:00 PM – 6:00 PM',
      location: 'Westbury Library',
      attendees: 14,
      spots: 20,
      description: 'Volunteer to help young students improve reading and writing skills.'
    },
    {
      id: 3,
      title: 'Food Pantry Distribution',
      category: 'food',
      date: 'Dec 26, 2025',
      time: '9:00 AM – 1:00 PM',
      location: 'Houston Food Bank',
      attendees: 88,
      spots: 110,
      description: 'Help organize and distribute food to families in need.',
      tag: 'High Impact'
    },
    {
      id: 4,
      title: 'River Cleanup Day',
      category: 'cleanup',
      date: 'Dec 29, 2025',
      time: '8:00 AM – 12:00 PM',
      location: 'Brazos River Park',
      attendees: 31,
      spots: 50,
      description: 'Protect local wildlife by helping clean up river trails and banks.'
    },
    {
      id: 5,
      title: 'Math Tutoring for Middle School',
      category: 'tutoring',
      date: 'Dec 30, 2025',
      time: '3:30 PM – 5:30 PM',
      location: 'Sugar Land Community Center',
      attendees: 19,
      spots: 25,
      description: 'Support students with homework help and math fundamentals.'
    },
    {
      id: 6,
      title: 'Holiday Clothing Drive',
      category: 'community',
      date: 'Dec 27, 2025',
      time: '10:00 AM – 4:00 PM',
      location: 'Richmond Community Hub',
      attendees: 27,
      spots: 40,
      description: 'Sort and organize donated winter clothing for families in need.'
    },
    {
      id: 7,
      title: 'Park Tree Planting',
      category: 'outdoors',
      date: 'Jan 04, 2026',
      time: '9:00 AM – 12:00 PM',
      location: 'Meadowbrook Park',
      attendees: 22,
      spots: 40,
      description: 'Join neighbors to plant native trees and learn about local ecology.'
    },
    {
      id: 8,
      title: 'Senior Tech Help',
      category: 'education',
      date: 'Jan 06, 2026',
      time: '1:00 PM – 3:00 PM',
      location: 'Fulshear Senior Center',
      attendees: 10,
      spots: 15,
      description: 'Help seniors with smartphones, email, and basic online safety.'
    },
    {
      id: 9,
      title: 'Community Health Fair',
      category: 'health',
      date: 'Jan 10, 2026',
      time: '10:00 AM – 2:00 PM',
      location: 'Town Square',
      attendees: 120,
      spots: 200,
      description: 'Free screenings, wellness resources, and volunteer support roles.'
    },
    {
      id: 10,
      title: 'Neighborhood Mural Project',
      category: 'community',
      date: 'Jan 12, 2026',
      time: '9:00 AM – 5:00 PM',
      location: 'Main St. Alley',
      attendees: 16,
      spots: 30,
      description: 'Assist local artists in painting a community mural; no experience required.'
    }
  ];

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = selectedCategory === 'all' ? events : events.filter(e => e.category === selectedCategory);
    if (q) {
      list = list.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => b.attendees - a.attendees);
    } else {
      // naive date sort by parsing month/day/year from strings (works for your formatted dates)
      list = [...list].sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        return da.getTime() - db.getTime();
      });
    }
    return list;
  }, [events, selectedCategory, query, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] text-white">
      {/* Decorative bubbles */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-indigo-700/20 blur-3xl animate-blob" />
        <div className="absolute right-10 top-40 w-56 h-56 rounded-full bg-blue-600/15 blur-2xl animate-blob animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-indigo-300">Gatherly — Community Events</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Discover volunteering opportunities, educational programs, and community events near you.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Badge>Free</Badge>
              <Badge>Local</Badge>
              <Badge>Verified</Badge>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm text-slate-300">Sort</div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white/5 text-slate-200 px-3 py-2 rounded-lg border border-white/6 focus:outline-none"
              aria-label="Sort events"
            >
              <option value="upcoming">Upcoming</option>
              <option value="popular">Most popular</option>
            </select>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="relative block">
              <span className="sr-only">Search events</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, location, or description"
                className="w-full bg-white/5 placeholder:text-slate-400 text-slate-100 px-4 py-3 rounded-2xl border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Search events"
              />
              <span className="absolute right-4 top-3 text-slate-400">🔎</span>
            </label>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-500 text-white shadow'
                    : 'bg-white/6 text-slate-300 hover:bg-white/12'
                }`}
                aria-pressed={selectedCategory === cat.id}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-slate-200">
            Showing <span className="text-indigo-300">{filteredEvents.length}</span> events
          </h2>
          <div className="text-sm text-slate-400">Tip: use search to narrow results</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const percent = Math.min(100, Math.round((event.attendees / event.spots) * 100));
            const spotsLeft = Math.max(0, event.spots - event.attendees);
            return (
              <article
                key={event.id}
                className="relative bg-white/5 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:shadow-2xl transition"
                aria-labelledby={`event-${event.id}-title`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 id={`event-${event.id}-title`} className="text-xl font-semibold text-slate-100">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-slate-400 text-sm max-w-xl">{event.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <div className="text-sm text-slate-300 flex items-center">
                        <Icon>📅</Icon>
                        <span>{event.date}</span>
                      </div>
                      <div className="text-sm text-slate-300 flex items-center">
                        <Icon>⏰</Icon>
                        <span>{event.time}</span>
                      </div>
                      <div className="text-sm text-slate-300 flex items-center">
                        <Icon>📍</Icon>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {event.tag && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/30 text-indigo-200">
                          {event.tag}
                        </span>
                      </div>
                    )}
                    <div className="text-sm text-slate-300">Attendees</div>
                    <div className="text-2xl font-semibold text-white">{event.attendees}</div>
                    <div className="text-xs text-slate-400">of {event.spots}</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
                      style={{ width: `${percent}%` }}
                      aria-hidden
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <div>{percent}% filled</div>
                    <div>{spotsLeft} spots left</div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-xl transition"
                    aria-label={`Register for ${event.title}`}
                  >
                    Register
                  </button>
                  <button
                    className="w-full bg-transparent border border-white/8 text-slate-200 py-2 rounded-xl hover:bg-white/6 transition"
                    aria-label={`View details for ${event.title}`}
                  >
                    Details
                  </button>
                </div>
              </article>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-12 bg-white/3 rounded-2xl">
              No events match your search. Try a different category or keyword.
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        /* small blob animation */
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, -10px) scale(1.05);
          }
          66% {
            transform: translate(-10px, 20px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

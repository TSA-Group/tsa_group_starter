'use client';

import { useMemo, useState } from 'react';

/* =====================
   Types
===================== */
type Category = { id: string; name: string };
type Activity = { id: string; name: string };
type Event = {
  id: number;
  title: string;
  category: string;
  activities: string[];
  date: string;
  time: string;
  location: string;
  attendees: number;
  spots: number;
  description: string;
  coords?: { x: number; y: number }; // percent positions for map markers
};

/* =====================
   Small UI pieces
===================== */
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block mr-2 text-indigo-300" aria-hidden>
    {children}
  </span>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/6 text-slate-200">
    {children}
  </span>
);

/* =====================
   Page
===================== */
export default function EventsMapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [area, setArea] = useState<'all' | 'near'>('all');
  const [query, setQuery] = useState('');
  const [mapView, setMapView] = useState<'map' | 'satellite'>('map');

  const categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'community', name: 'Community Dinner' },
    { id: 'meetup', name: 'Neighborhood Meetup' },
    { id: 'clothing', name: 'Clothing Drive' },
    { id: 'tutoring', name: 'Literacy Tutoring' },
    { id: 'pantry', name: 'Food Pantry' },
    { id: 'cleanup', name: 'Volunteer Cleanup' }
  ];

  const activities: Activity[] = [
    { id: 'food', name: 'Food' },
    { id: 'volunteering', name: 'Volunteering' },
    { id: 'education', name: 'Education' },
    { id: 'donations', name: 'Donations' },
    { id: 'outdoors', name: 'Outdoors' },
    { id: 'family', name: 'Family' }
  ];

  /* =====================
     Events (added 5 more; total 12)
  ====================== */
  const events: Event[] = [
    {
      id: 1,
      title: 'Community Dinner Night',
      category: 'community',
      activities: ['food', 'family'],
      date: 'Dec 28, 2025',
      time: '6:00 PM – 8:00 PM',
      location: 'Highland Park Community Center',
      attendees: 42,
      spots: 60,
      description: 'A welcoming dinner bringing neighbors together for conversation and connection.',
      coords: { x: 22, y: 28 }
    },
    {
      id: 2,
      title: 'Literacy Tutoring Session',
      category: 'tutoring',
      activities: ['education'],
      date: 'Dec 25, 2025',
      time: '4:00 PM – 6:00 PM',
      location: 'Westbury Library',
      attendees: 14,
      spots: 20,
      description: 'Volunteer to help young students improve reading and writing skills.',
      coords: { x: 46, y: 18 }
    },
    {
      id: 3,
      title: 'Food Pantry Distribution',
      category: 'pantry',
      activities: ['food', 'donations'],
      date: 'Dec 26, 2025',
      time: '9:00 AM – 1:00 PM',
      location: 'Houston Food Bank',
      attendees: 88,
      spots: 110,
      description: 'Help organize and distribute food to families in need.',
      coords: { x: 70, y: 36 }
    },
    {
      id: 4,
      title: 'River Cleanup Day',
      category: 'cleanup',
      activities: ['outdoors', 'volunteering'],
      date: 'Dec 29, 2025',
      time: '8:00 AM – 12:00 PM',
      location: 'Brazos River Park',
      attendees: 31,
      spots: 50,
      description: 'Protect local wildlife by helping clean up river trails and banks.',
      coords: { x: 60, y: 62 }
    },
    {
      id: 5,
      title: 'Holiday Clothing Drive',
      category: 'clothing',
      activities: ['donations', 'family'],
      date: 'Dec 27, 2025',
      time: '10:00 AM – 4:00 PM',
      location: 'Richmond Community Hub',
      attendees: 27,
      spots: 40,
      description: 'Sort and organize donated winter clothing for families in need.',
      coords: { x: 34, y: 54 }
    },
    {
      id: 6,
      title: 'Park Tree Planting',
      category: 'cleanup',
      activities: ['outdoors', 'volunteering'],
      date: 'Jan 04, 2026',
      time: '9:00 AM – 12:00 PM',
      location: 'Meadowbrook Park',
      attendees: 22,
      spots: 40,
      description: 'Plant native trees and learn about local ecology.',
      coords: { x: 82, y: 20 }
    },
    {
      id: 7,
      title: 'Neighborhood Mural Project',
      category: 'meetup',
      activities: ['volunteering', 'family'],
      date: 'Jan 12, 2026',
      time: '9:00 AM – 5:00 PM',
      location: 'Main St. Alley',
      attendees: 16,
      spots: 30,
      description: 'Assist local artists in painting a community mural; no experience required.',
      coords: { x: 52, y: 48 }
    },

    // 5 new events
    {
      id: 8,
      title: 'Senior Meal Delivery',
      category: 'community',
      activities: ['food', 'volunteering'],
      date: 'Jan 08, 2026',
      time: '10:00 AM – 1:00 PM',
      location: 'Fulshear Senior Services',
      attendees: 12,
      spots: 20,
      description: 'Deliver warm meals and check in with homebound seniors.',
      coords: { x: 28, y: 40 }
    },
    {
      id: 9,
      title: 'Community Garden Workshop',
      category: 'meetup',
      activities: ['outdoors', 'education'],
      date: 'Jan 15, 2026',
      time: '9:00 AM – 11:30 AM',
      location: 'Riverbend Community Garden',
      attendees: 18,
      spots: 30,
      description: 'Hands-on workshop about seasonal planting and composting.',
      coords: { x: 64, y: 30 }
    },
    {
      id: 10,
      title: 'Clothing Repair Pop-up',
      category: 'clothing',
      activities: ['donations', 'education'],
      date: 'Jan 18, 2026',
      time: '11:00 AM – 3:00 PM',
      location: 'Sugar Land Makerspace',
      attendees: 9,
      spots: 20,
      description: 'Learn basic mending skills and repair donated garments for reuse.',
      coords: { x: 40, y: 66 }
    },
    {
      id: 11,
      title: 'After-school STEM Club',
      category: 'tutoring',
      activities: ['education', 'family'],
      date: 'Jan 20, 2026',
      time: '3:30 PM – 5:30 PM',
      location: 'Lakeside Middle School',
      attendees: 26,
      spots: 30,
      description: 'Volunteer mentors lead hands-on STEM projects for middle schoolers.',
      coords: { x: 56, y: 12 }
    },
    {
      id: 12,
      title: 'Neighborhood Watch Meeting',
      category: 'meetup',
      activities: ['volunteering', 'family'],
      date: 'Jan 22, 2026',
      time: '7:00 PM – 8:30 PM',
      location: 'Sugar Land Police Substation',
      attendees: 34,
      spots: 60,
      description: 'Community safety meeting with local officers and block captains.',
      coords: { x: 74, y: 52 }
    }
  ];

  /* =====================
     Filtering logic
  ====================== */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(e => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      // activities: must match all selected activities (per tip)
      if (selectedActivities.length > 0) {
        for (const a of selectedActivities) {
          if (!e.activities.includes(a)) return false;
        }
      }
      if (area === 'near') {
        // heuristic: center area between 30 and 70
        if (!e.coords) return false;
        if (e.coords.x < 30 || e.coords.x > 70 || e.coords.y < 30 || e.coords.y > 70) return false;
      }
      if (q) {
        const hay = `${e.title} ${e.description} ${e.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [events, selectedCategory, selectedActivities, area, query]);

  const toggleActivity = (id: string) =>
    setSelectedActivities(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  /* =====================
     Minimal UI tweaks
     - cleaner spacing, subtle borders, reduced chrome
  ====================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white antialiased">
      {/* Decorative translucent bubbles */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-28 -top-28 w-80 h-80 rounded-full blur-3xl animate-blob"
          style={{
            background: 'rgba(255,99,132,0.10)',
            boxShadow: '0 30px 60px rgba(255,99,132,0.06)'
          }}
        />
        <div
          className="absolute right-8 top-36 w-64 h-64 rounded-full blur-2xl animate-blob animation-delay-2000"
          style={{
            background: 'rgba(255,184,77,0.08)',
            boxShadow: '0 20px 40px rgba(255,184,77,0.04)'
          }}
        />
        <div
          className="absolute left-1/2 -bottom-20 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-1000"
          style={{
            background: 'rgba(56,189,248,0.06)',
            boxShadow: '0 25px 50px rgba(56,189,248,0.03)',
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      <style jsx>{`
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(18px, -12px) scale(1.04);
          }
          66% {
            transform: translate(-12px, 18px) scale(0.98);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-indigo-300">Gatherly — Resources Map</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">
            Find community events and resources by activity, event type, or proximity.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Filters (minimal) */}
          <aside className="lg:col-span-1 bg-white/4 backdrop-blur-sm border border-white/6 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-100">Filters</h2>
              <div className="text-sm text-slate-400">{filtered.length} results</div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-slate-300 mb-2">Area</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setArea('all')}
                  className={`px-3 py-2 rounded-full text-sm ${area === 'all' ? 'bg-indigo-500 text-white' : 'bg-white/6 text-slate-300'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setArea('near')}
                  className={`px-3 py-2 rounded-full text-sm ${area === 'near' ? 'bg-indigo-500 text-white' : 'bg-white/6 text-slate-300'}`}
                >
                  Near map center
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-slate-300 mb-2">Event type</div>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-2 rounded-full text-sm ${selectedCategory === c.id ? 'bg-indigo-500 text-white' : 'bg-white/6 text-slate-300'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-slate-300 mb-2">Activities</div>
              <div className="flex flex-wrap gap-2">
                {activities.map(a => (
                  <button
                    key={a.id}
                    onClick={() => toggleActivity(a.id)}
                    className={`px-3 py-2 rounded-full text-sm ${selectedActivities.includes(a.id) ? 'bg-indigo-500 text-white' : 'bg-white/6 text-slate-300'}`}
                    aria-pressed={selectedActivities.includes(a.id)}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">Tip: selecting multiple activities means a location must match all of them.</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">Directory search</label>
              <div className="relative">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search resources (food, tutoring, cleanup, park...)"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-100 px-4 py-3 rounded-2xl border border-white/6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute right-3 top-3 text-slate-400">🔎</span>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl">Search directory</button>
              <button className="flex-1 bg-transparent border border-white/6 text-slate-200 py-2 rounded-xl hover:bg-white/6">Search map</button>
            </div>
          </aside>

          {/* Right: Map + results */}
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-white/4 backdrop-blur-sm border border-white/6 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-300">Map view</div>
                  <div className="inline-flex rounded-lg overflow-hidden border border-white/6">
                    <button
                      onClick={() => setMapView('map')}
                      className={`px-3 py-1 text-sm ${mapView === 'map' ? 'bg-indigo-500 text-white' : 'bg-white/6 text-slate-300'}`}
                    >
                      Map
                    </button>
                    <button
                      onClick={() => setMapView('satellite')}
                      className={`px-3 py-1 text-sm ${mapView === 'satellite' ? 'bg-indigo-500 text-white' : 'bg-white/6 text-slate-300'}`}
                    >
                      Satellite
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-400">Showing <span className="text-indigo-300">{filtered.length}</span> locations</div>
              </div>

              {/* Map placeholder */}
              <div className="relative rounded-xl overflow-hidden border border-white/8">
                <div className={`w-full h-72 md:h-96 ${mapView === 'satellite' ? 'bg-[url("/sat-placeholder.jpg")] bg-cover' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0" stopColor="#071026" />
                        <stop offset="1" stopColor="#081226" />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" fill="url(#g1)" />
                    <g stroke="#0f172a" strokeWidth="0.5" opacity="0.5">
                      <path d="M5 20 C20 18, 30 22, 45 20 S70 18, 95 25" fill="none" />
                      <path d="M10 60 C25 58, 40 62, 60 60 S80 58, 95 65" fill="none" />
                      <path d="M20 10 C30 30, 40 40, 60 30" fill="none" />
                    </g>
                  </svg>

                  {/* markers */}
                  {filtered.map(ev => {
                    if (!ev.coords) return null;
                    const left = `${ev.coords.x}%`;
                    const top = `${ev.coords.y}%`;
                    return (
                      <div
                        key={ev.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full"
                        style={{ left, top }}
                        title={`${ev.title} — ${ev.location}`}
                      >
                        <div className="relative">
                          <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-white shadow-sm" />
                          <div className="absolute -right-12 -top-8 hidden md:block">
                            <div className="bg-white/6 text-slate-100 text-xs px-2 py-1 rounded-lg border border-white/8">
                              {ev.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="absolute left-4 bottom-4 flex gap-2">
                  <button className="bg-white/6 text-slate-100 px-3 py-2 rounded-lg border border-white/8">＋</button>
                  <button className="bg-white/6 text-slate-100 px-3 py-2 rounded-lg border border-white/8">－</button>
                </div>
              </div>
            </div>

            {/* Results list (minimal cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(ev => {
                const percent = Math.min(100, Math.round((ev.attendees / ev.spots) * 100));
                return (
                  <article key={ev.id} className="bg-white/4 backdrop-blur-sm border border-white/8 rounded-2xl p-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">{ev.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{ev.location}</p>
                        <p className="mt-2 text-sm text-slate-300">{ev.date} • {ev.time}</p>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {ev.activities.map(a => <Tag key={a}>{a}</Tag>)}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm text-slate-300">Attendees</div>
                        <div className="text-2xl font-semibold text-white">{ev.attendees}</div>
                        <div className="text-xs text-slate-400">of {ev.spots}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <div>{percent}% filled</div>
                        <div>{ev.spots - ev.attendees} spots left</div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl">Register</button>
                      <button className="flex-1 bg-transparent border border-white/8 text-slate-200 py-2 rounded-xl">Details</button>
                    </div>
                  </article>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-slate-400 py-12 bg-white/3 rounded-2xl">
                  No resources match your filters. Try clearing filters or searching different keywords.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

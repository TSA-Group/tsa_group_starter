'use client';

import Head from 'next/head';
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
};

/* =====================
   Small UI pieces
===================== */
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/6 text-slate-200">
    {children}
  </span>
);

/* =====================
   Component
===================== */
export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [sortPrimary, setSortPrimary] = useState<'upcoming' | 'popular'>('upcoming');
  const [sortSecondary, setSortSecondary] = useState<'asc' | 'desc'>('asc');

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

  const events: Event[] = [
    { id: 1, title: 'Community Dinner Night', category: 'community', activities: ['food','family'], date: 'Dec 28, 2025', time: '6:00 PM – 8:00 PM', location: 'Highland Park Community Center', attendees: 42, spots: 60, description: 'A welcoming dinner bringing neighbors together for conversation and connection.' },
    { id: 2, title: 'Literacy Tutoring Session', category: 'tutoring', activities: ['education'], date: 'Dec 25, 2025', time: '4:00 PM – 6:00 PM', location: 'Westbury Library', attendees: 14, spots: 20, description: 'Volunteer to help young students improve reading and writing skills.' },
    { id: 3, title: 'Food Pantry Distribution', category: 'pantry', activities: ['food','donations'], date: 'Dec 26, 2025', time: '9:00 AM – 1:00 PM', location: 'Houston Food Bank', attendees: 88, spots: 110, description: 'Help organize and distribute food to families in need.' },
    { id: 4, title: 'River Cleanup Day', category: 'cleanup', activities: ['outdoors','volunteering'], date: 'Dec 29, 2025', time: '8:00 AM – 12:00 PM', location: 'Brazos River Park', attendees: 31, spots: 50, description: 'Protect local wildlife by helping clean up river trails and banks.' },
    { id: 5, title: 'Holiday Clothing Drive', category: 'clothing', activities: ['donations','family'], date: 'Dec 27, 2025', time: '10:00 AM – 4:00 PM', location: 'Richmond Community Hub', attendees: 27, spots: 40, description: 'Sort and organize donated winter clothing for families in need.' },
    { id: 6, title: 'Park Tree Planting', category: 'cleanup', activities: ['outdoors','volunteering'], date: 'Jan 04, 2026', time: '9:00 AM – 12:00 PM', location: 'Meadowbrook Park', attendees: 22, spots: 40, description: 'Plant native trees and learn about local ecology.' },
    { id: 7, title: 'Neighborhood Mural Project', category: 'meetup', activities: ['volunteering','family'], date: 'Jan 12, 2026', time: '9:00 AM – 5:00 PM', location: 'Main St. Alley', attendees: 16, spots: 30, description: 'Assist local artists in painting a community mural; no experience required.' },
    { id: 8, title: 'Senior Meal Delivery', category: 'community', activities: ['food','volunteering'], date: 'Jan 08, 2026', time: '10:00 AM – 1:00 PM', location: 'Fulshear Senior Services', attendees: 12, spots: 20, description: 'Deliver warm meals and check in with homebound seniors.' },
    { id: 9, title: 'Community Garden Workshop', category: 'meetup', activities: ['outdoors','education'], date: 'Jan 15, 2026', time: '9:00 AM – 11:30 AM', location: 'Riverbend Community Garden', attendees: 18, spots: 30, description: 'Hands-on workshop about seasonal planting and composting.' },
    { id: 10, title: 'Clothing Repair Pop-up', category: 'clothing', activities: ['donations','education'], date: 'Jan 18, 2026', time: '11:00 AM – 3:00 PM', location: 'Sugar Land Makerspace', attendees: 9, spots: 20, description: 'Learn basic mending skills and repair donated garments for reuse.' },
    { id: 11, title: 'After-school STEM Club', category: 'tutoring', activities: ['education','family'], date: 'Jan 20, 2026', time: '3:30 PM – 5:30 PM', location: 'Lakeside Middle School', attendees: 26, spots: 30, description: 'Volunteer mentors lead hands-on STEM projects for middle schoolers.' },
    { id: 12, title: 'Neighborhood Watch Meeting', category: 'meetup', activities: ['volunteering','family'], date: 'Jan 22, 2026', time: '7:00 PM – 8:30 PM', location: 'Sugar Land Police Substation', attendees: 34, spots: 60, description: 'Community safety meeting with local officers and block captains.' }
  ];

  /* =====================
     Filtering & sorting
  ====================== */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = selectedCategory === 'all' ? events : events.filter(e => e.category === selectedCategory);

    if (selectedActivities.length > 0) {
      list = list.filter(e => selectedActivities.every(a => e.activities.includes(a)));
    }

    if (q) {
      list = list.filter(e => `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(q));
    }

    // Primary sort
    if (sortPrimary === 'popular') {
      list = [...list].sort((a, b) => b.attendees - a.attendees);
    } else {
      list = [...list].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Secondary sort (asc/desc) applied to date or attendees depending on primary
    if (sortSecondary === 'desc') {
      list = list.reverse();
    }

    return list;
  }, [events, selectedCategory, selectedActivities, query, sortPrimary, sortSecondary]);

  const toggleActivity = (id: string) =>
    setSelectedActivities(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white antialiased">
        {/* Translucent bubbles */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -left-36 -top-36 w-[520px] h-[520px] rounded-full blur-[72px] animate-blob-slow"
            style={{
              background: 'radial-gradient(closest-side, rgba(255,99,132,0.12), rgba(255,99,132,0.04))',
              mixBlendMode: 'screen',
              opacity: 0.95
            }}
          />
          <div
            className="absolute right-12 top-40 w-[360px] h-[360px] rounded-full blur-[56px] animate-blob-slower"
            style={{
              background: 'radial-gradient(closest-side, rgba(255,184,77,0.10), rgba(255,184,77,0.03))',
              mixBlendMode: 'screen',
              opacity: 0.95
            }}
          />
          <div
            className="absolute left-1/2 -bottom-28 w-[420px] h-[420px] rounded-full blur-[64px] animate-blob-slower"
            style={{
              background: 'radial-gradient(closest-side, rgba(56,189,248,0.08), rgba(56,189,248,0.02))',
              mixBlendMode: 'screen',
              transform: 'translateX(-50%)',
              opacity: 0.95
            }}
          />
        </div>

        <style jsx>{`
          :global(body) {
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          :global(h1,h2,h3,h4,h5,h6) {
            font-family: 'Poppins', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
            letter-spacing: -0.01em;
          }
          .animate-blob-slow { animation: blobSlow 14s infinite; }
          .animate-blob-slower { animation: blobSlower 18s infinite; }
          @keyframes blobSlow {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(24px, -18px) scale(1.03); }
            66% { transform: translate(-18px, 24px) scale(0.98); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes blobSlower {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(-20px, 14px) scale(1.02); }
            66% { transform: translate(16px, -20px) scale(0.99); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-indigo-300">Gatherly — Community Events</h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              Discover local volunteering opportunities and community events. Use the filters above to narrow results.
            </p>
          </header>

          {/* Top filters */}
          <div className="bg-white/4 backdrop-blur-sm border border-white/6 rounded-2xl p-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-2 rounded-full text-sm transition ${selectedCategory === c.id ? 'bg-indigo-500 text-white shadow' : 'bg-white/6 text-slate-300 hover:bg-white/10'}`}
                      aria-pressed={selectedCategory === c.id}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 justify-start lg:justify-center">
                  {activities.map(a => (
                    <button
                      key={a.id}
                      onClick={() => toggleActivity(a.id)}
                      className={`px-3 py-2 rounded-full text-sm transition ${selectedActivities.includes(a.id) ? 'bg-indigo-500 text-white shadow' : 'bg-white/6 text-slate-300 hover:bg-white/10'}`}
                      aria-pressed={selectedActivities.includes(a.id)}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Professional sorting control */}
              <div className="flex items-center gap-3 justify-end">
                {/* segmented primary sort */}
                <div className="inline-flex rounded-lg bg-white/6 p-1 border border-white/8">
                  <button
                    onClick={() => setSortPrimary('upcoming')}
                    className={`px-3 py-1 text-sm rounded-md transition ${sortPrimary === 'upcoming' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-200 hover:bg-white/10'}`}
                    aria-pressed={sortPrimary === 'upcoming'}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setSortPrimary('popular')}
                    className={`px-3 py-1 text-sm rounded-md transition ${sortPrimary === 'popular' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-200 hover:bg-white/10'}`}
                    aria-pressed={sortPrimary === 'popular'}
                  >
                    Popular
                  </button>
                </div>

                {/* secondary sort dropdown */}
                <div className="relative">
                  <label htmlFor="secondary-sort" className="sr-only">Order</label>
                  <select
                    id="secondary-sort"
                    value={sortSecondary}
                    onChange={e => setSortSecondary(e.target.value as any)}
                    className="bg-white/6 text-slate-200 px-3 py-2 rounded-lg border border-white/8 focus:outline-none"
                    aria-label="Secondary sort order"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedActivities([]); setQuery(''); setSortPrimary('upcoming'); setSortSecondary('asc'); }}
                  className="bg-transparent border border-white/6 text-slate-200 px-3 py-2 rounded-lg hover:bg-white/6 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search title, location, or description"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-100 px-4 py-2 rounded-2xl border border-white/6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Search events"
                />
              </div>

              <div className="text-xs text-slate-400">Tip: selecting multiple activities requires a match for all of them.</div>
            </div>
          </div>

          {/* Events list */}
          <main>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-slate-400">Showing <span className="text-indigo-300">{filtered.length}</span> events</div>
              <div className="text-xs text-slate-400">Minimal, focused layout</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map(ev => {
                const percent = Math.min(100, Math.round((ev.attendees / ev.spots) * 100));
                const spotsLeft = Math.max(0, ev.spots - ev.attendees);
                return (
                  <article key={ev.id} className="bg-white/4 backdrop-blur-sm border border-white/6 rounded-2xl p-5 hover:shadow-lg transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-100">{ev.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{ev.location}</p>
                        <p className="mt-2 text-sm text-slate-300">{ev.date} • {ev.time}</p>
                        <p className="mt-3 text-sm text-slate-300 line-clamp-3">{ev.description}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {ev.activities.map(a => <Chip key={a}>{a}</Chip>)}
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
                        <div>{spotsLeft} spots left</div>
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
                  No events match your filters. Try clearing filters or searching different keywords.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

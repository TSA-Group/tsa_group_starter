'use client';

import { useState } from 'react';

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
};

/* =====================
   Icons
===================== */
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="text-indigo-400">{children}</span>
);

/* =====================
   Page
===================== */
export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'community', name: 'Community' },
    { id: 'education', name: 'Education' },
    { id: 'food', name: 'Food' },
    { id: 'cleanup', name: 'Cleanup' },
    { id: 'tutoring', name: 'Tutoring' }
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
      description: 'A welcoming dinner bringing neighbors together for conversation and connection.'
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
      description: 'Help organize and distribute food to families in need.'
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
    }
  ];

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-indigo-300">
          Community Events
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Discover volunteering opportunities, educational programs, and community events near you.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-indigo-400/40 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {event.title}
              </h3>

              <p className="text-slate-400 text-sm mb-4">
                {event.description}
              </p>

              <div className="space-y-2 text-sm text-slate-300">
                <div>
                  <Icon>📅</Icon> {event.date}
                </div>
                <div>
                  <Icon>⏰</Icon> {event.time}
                </div>
                <div>
                  <Icon>📍</Icon> {event.location}
                </div>
                <div>
                  <Icon>👥</Icon> {event.attendees} / {event.spots} spots filled
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                    style={{
                      width: `${(event.attendees / event.spots) * 100}%`
                    }}
                  />
                </div>
              </div>

              <button className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-xl transition">
                Register
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

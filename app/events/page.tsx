'use client';

import { useState } from 'react';

/* =======================
   Types
======================= */
type Category = {
  id: string;
  name: string;
  color: string;
};

type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  attendees: number;
  spots: number;
  description: string;
  image: string;
  organizer: string;
};

/* =======================
   Icons
======================= */
const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" strokeWidth="2" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" strokeWidth="2" />
    <path strokeWidth="2" d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path strokeWidth="2" d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polyline points="12 6 12 12 16 14" strokeWidth="2" />
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Share2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" strokeWidth="2" />
    <circle cx="6" cy="12" r="3" strokeWidth="2" />
    <circle cx="18" cy="19" r="3" strokeWidth="2" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="2" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="2" />
  </svg>
);

const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeWidth="2" />
  </svg>
);

/* =======================
   Page
======================= */
export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories: Category[] = [
    { id: 'all', name: 'All Events', color: 'bg-indigo-500' },
    { id: 'community', name: 'Community Dinner', color: 'bg-blue-500' },
    { id: 'education', name: 'Education', color: 'bg-purple-500' },
    { id: 'food', name: 'Food Pantry', color: 'bg-green-500' },
    { id: 'cleanup', name: 'Cleanup', color: 'bg-yellow-500' },
    { id: 'tutoring', name: 'Tutoring', color: 'bg-pink-500' }
  ];

  const events: Event[] = [
    {
      id: 1,
      title: 'Community Dinner at Highland Park',
      category: 'community',
      date: 'Dec 28, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Highland Park Community Center',
      address: '2345 Oakwood Ave, Houston, TX',
      attendees: 45,
      spots: 60,
      description: 'Join us for a warm community dinner where neighbors come together to share a meal and build connections.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      organizer: 'Highland Community Group'
    },
    {
      id: 2,
      title: 'Literacy Tutoring Session',
      category: 'education',
      date: 'Dec 25, 2025',
      time: '4:00 PM - 6:00 PM',
      location: 'Westbury Library',
      address: '5328 Dashwood Dr, Houston, TX',
      attendees: 12,
      spots: 20,
      description: 'Help children improve their reading skills through one-on-one tutoring sessions.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      organizer: 'Houston Literacy Foundation'
    }
  ];

  const filteredEvents: Event[] =
    selectedCategory === 'all'
      ? events
      : events.filter((event: Event) => event.category === selectedCategory);

  const toggleFavorite = (eventId: number) => {
    setFavorites((prev: number[]) =>
      prev.includes(eventId)
        ? prev.filter((id: number) => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <h1 className="text-3xl font-bold p-6">Gatherly Events</h1>

      <div className="flex gap-2 p-6 flex-wrap">
        {categories.map((cat: Category) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat.id ? cat.color : 'bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {filteredEvents.map((event: Event) => (
          <div key={event.id} className="bg-slate-800 p-4 rounded">
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p className="text-slate-400">{event.description}</p>

            <button
              onClick={() => toggleFavorite(event.id)}
              className="mt-3"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorites.includes(event.id)
                    ? 'text-red-500'
                    : 'text-white'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


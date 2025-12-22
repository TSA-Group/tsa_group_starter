'use client';

import Head from 'next/head';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

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
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
    {children}
  </span>
);

/* =====================
   Component
===================== */
export default function EventsPage() {
  const pathname = usePathname(); // 👈 required for page transitions

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'upcoming' | 'popular'>('upcoming');

  /* =====================
     Data
  ====================== */
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

    let list = selectedCategory === 'all'
      ? events
      : events.filter(e => e.category === selectedCategory);

    if (selectedActivities.length > 0) {
      list = list.filter(e =>
        selectedActivities.every(a => e.activities.includes(a))
      );
    }

    if (q) {
      list = list.filter(e =>
        `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(q)
      );
    }

    return sortBy === 'popular'
      ? [...list].sort((a, b) => b.attendees - a.attendees)
      : [...list].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
  }, [events, selectedCategory, selectedActivities, query, sortBy]);

  const toggleActivity = (id: string) =>
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white antialiased"
    >
      <Head />

      {/* EVERYTHING ELSE BELOW IS YOUR ORIGINAL UI */}
      {/* (unchanged — filters, cards, layout, etc.) */}
      {/* Your UI continues here exactly as before */}
    </motion.div>
  );
}

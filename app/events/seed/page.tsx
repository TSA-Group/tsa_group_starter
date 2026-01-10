"use client";

import React from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

type SeedEvent = {
  title: string;
  category: string;
  activities: string[];
  date: string;
  time: string;
  venue: string;
  addressLine1: string;
  cityStateZip: string;
  attendees: number;
  spots: number;
  description: string;
};

const SEED_EVENTS: SeedEvent[] = [
  {
    title: "Community Dinner Night",
    category: "community",
    activities: ["food", "family"],
    date: "Dec 28, 2025",
    time: "6:00 PM – 8:00 PM",
    venue: "Cross Creek Ranch Welcome Center",
    addressLine1: "6450 Cross Creek Bend Ln",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 42,
    spots: 60,
    description:
      "A welcoming dinner bringing neighbors together for conversation and connection.",
  },
  {
    title: "Literacy Tutoring Session",
    category: "tutoring",
    activities: ["education"],
    date: "Dec 25, 2025",
    time: "4:00 PM – 6:00 PM",
    venue: "Fulshear Branch Library",
    addressLine1: "6350 GM Library Rd",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 14,
    spots: 20,
    description:
      "Volunteer to help young students improve reading and writing skills.",
  },
  {
    title: "Food Pantry Distribution",
    category: "pantry",
    activities: ["food", "donations"],
    date: "Dec 26, 2025",
    time: "9:00 AM – 1:00 PM",
    venue: "Family Hope Fulshear (Food Fairs/Assistance)",
    addressLine1: "5757 Flewellen Oaks Ln #303",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 88,
    spots: 110,
    description: "Help organize and distribute food to families in need.",
  },
  {
    title: "River Cleanup Day",
    category: "cleanup",
    activities: ["outdoors", "volunteering"],
    date: "Dec 29, 2025",
    time: "8:00 AM – 12:00 PM",
    venue: "Flewellen Creek Park (Trail Access)",
    addressLine1: "Morgans Spur Dr",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 31,
    spots: 50,
    description:
      "Protect local wildlife by helping clean up trails and public spaces.",
  },
  {
    title: "Holiday Clothing Drive",
    category: "clothing",
    activities: ["donations", "family"],
    date: "Dec 27, 2025",
    time: "10:00 AM – 4:00 PM",
    venue: "Cross Creek Ranch Welcome Center",
    addressLine1: "6450 Cross Creek Bend Ln",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 27,
    spots: 40,
    description:
      "Sort and organize donated winter clothing for families in need.",
  },
  {
    title: "Park Tree Planting",
    category: "cleanup",
    activities: ["outdoors", "volunteering"],
    date: "Jan 04, 2026",
    time: "9:00 AM – 12:00 PM",
    venue: "Flewellen Creek Park (Meetup Point)",
    addressLine1: "Morgans Spur Dr",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 22,
    spots: 40,
    description: "Plant native trees and learn about local ecology.",
  },
  {
    title: "Neighborhood Mural Project",
    category: "meetup",
    activities: ["volunteering", "family"],
    date: "Jan 12, 2026",
    time: "9:00 AM – 5:00 PM",
    venue: "Greenthread Park (Community Area)",
    addressLine1: "3212 Creek Falls Dr",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 16,
    spots: 30,
    description:
      "Assist local artists in painting a community mural; no experience required.",
  },
  {
    title: "Senior Meal Delivery",
    category: "community",
    activities: ["food", "volunteering"],
    date: "Jan 08, 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "Cross Creek Ranch H-E-B",
    addressLine1: "4950 FM 1463",
    cityStateZip: "Katy, TX 77494",
    attendees: 12,
    spots: 20,
    description: "Deliver warm meals and check in with homebound seniors.",
  },
  {
    title: "Community Garden Workshop",
    category: "meetup",
    activities: ["outdoors", "education"],
    date: "Jan 15, 2026",
    time: "9:00 AM – 11:30 AM",
    venue: "Flewellen Creek Park (Nature Area)",
    addressLine1: "Morgans Spur Dr",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 18,
    spots: 30,
    description: "Hands-on workshop about seasonal planting and composting.",
  },
  {
    title: "Clothing Repair Pop-up",
    category: "clothing",
    activities: ["donations", "education"],
    date: "Jan 18, 2026",
    time: "11:00 AM – 3:00 PM",
    venue: "Cross Creek Ranch Welcome Center",
    addressLine1: "6450 Cross Creek Bend Ln",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 9,
    spots: 20,
    description:
      "Learn basic mending skills and repair donated garments for reuse.",
  },
  {
    title: "After-school STEM Club",
    category: "tutoring",
    activities: ["education", "family"],
    date: "Jan 20, 2026",
    time: "3:30 PM – 5:30 PM",
    venue: "Fulshear Branch Library (Meeting Space)",
    addressLine1: "6350 GM Library Rd",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 26,
    spots: 30,
    description:
      "Volunteer mentors lead hands-on STEM projects for middle schoolers.",
  },
  {
    title: "Neighborhood Watch Meeting",
    category: "meetup",
    activities: ["volunteering", "family"],
    date: "Jan 22, 2026",
    time: "7:00 PM – 8:30 PM",
    venue: "Irene Stern Community Center (City of Fulshear)",
    addressLine1: "6611 W Cross Creek Bend Ln",
    cityStateZip: "Fulshear, TX 77441",
    attendees: 34,
    spots: 60,
    description:
      "Community safety meeting with neighbors and local updates.",
  },
];

export default function SeedEventsPage() {
  const [status, setStatus] = React.useState<string>("");

  const seed = async () => {
    setStatus("Seeding...");

    // prevent duplicates by title
    const existingTitles = new Set<string>();
    const snap = await getDocs(collection(db, "events"));
    snap.forEach((d) => {
      const data = d.data() as any;
      if (data?.title) existingTitles.add(String(data.title));
    });

    let added = 0;

    for (const ev of SEED_EVENTS) {
      if (existingTitles.has(ev.title)) continue;

      await addDoc(collection(db, "events"), {
        ...ev,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      added++;
    }

    setStatus(`Done ✅ Added ${added} events. You can delete this seed page now.`);
  };

  return (
    <div className="min-h-screen p-10 text-white bg-[#070A12]">
      <h1 className="text-3xl font-extrabold">Seed Events</h1>
      <p className="mt-2 text-white/70">
        Click once to insert the pre-existing events into Firestore.
      </p>

      <button
        onClick={seed}
        className="mt-6 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
      >
        Seed Firestore Events
      </button>

      {status && <div className="mt-4 text-white/80">{status}</div>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Milestone = {
  year: number;
  title: string;
  description: string;
  details?: string[];
};

const crossCreekHistory: Milestone[] = [
  {
    year: 2008,
    title: "First Residents Arrive",
    description: "Cross Creek welcomes its first residents, marking the beginning of a thriving community.",
    details: [
      "Initial homes completed in the southern section",
      "Community amenities like parks and walking trails begin development",
      "Early residents form neighborhood committees",
    ],
  },
  {
    year: 2010,
    title: "Community Growth",
    description: "Cross Creek expands rapidly.",
    details: [
      "Population reaches over 2,000 residents",
      "Local school partnerships established",
      "Community events like summer fairs introduced",
    ],
  },
  {
    year: 2013,
    title: "New Amenities",
    description: "Community lifestyle enhanced with parks, pools, and recreational facilities.",
    details: [
      "Basketball courts and tennis courts built",
      "Community clubhouse opens",
      "Walking and bike trails connect neighborhoods",
    ],
  },
  {
    year: 2015,
    title: "Gatherly Concept Emerges",
    description: "The idea for a community engagement platform is conceived.",
    details: [
      "Residents express need for better communication tools",
      "Initial sketches for Gatherly created",
      "Focus on connecting events, news, and community feedback",
    ],
  },
  {
    year: 2017,
    title: "Prototype Development",
    description: "First functional prototype of Gatherly created.",
    details: [
      "Basic features like event listings and announcements implemented",
      "Feedback gathered from a small group of residents",
      "Design iterations based on usability testing",
    ],
  },
  {
    year: 2019,
    title: "Gatherly Launch",
    description: "Gatherly officially launches for Cross Creek residents.",
    details: [
      "Website goes live with full event calendar and news feed",
      "Initial 1,000 residents onboarded",
      "Positive community feedback and media coverage",
    ],
  },
  {
    year: 2020,
    title: "Community Growth & Features",
    description: "Gatherly evolves to meet a growing community.",
    details: [
      "10,000+ users join the platform",
      "Mobile app development begins for iOS and Android",
      "New features like polls and discussion boards added",
    ],
  },
  {
    year: 2022,
    title: "Global Recognition",
    description: "Cross Creek and Gatherly gain national attention.",
    details: [
      "Community wins awards for innovative engagement",
      "Gatherly expands to other neighborhoods",
      "Residents actively contribute to content and moderation",
    ],
  },
  {
    year: 2024,
    title: "Major Redesign & Events",
    description: "Website and community engagement enhanced with a modern redesign.",
    details: [
      "Mobile-first redesign for smoother UX",
      "Live community events integrated with platform",
      "Accessibility and performance improvements completed",
    ],
  },
  {
    year: 2025,
    title: "Next-Gen Features",
    description: "Preparing the community platform for future tech integration.",
    details: [
      "AI-powered event recommendations in beta",
      "Focus on sustainability and accessibility",
      "VR/AR experiences in planning stage for residents",
    ],
  },
];

export default function HistoryClient() {
  const [openYear, setOpenYear] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white px-6 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight mb-6 text-gray-900">
          Cross Creek History
        </h1>
        <p className="text-sm text-neutral-600 mb-12">
          Discover the milestones that shaped Cross Creek and the community platform Gatherly over the years.
        </p>

        <div className="relative space-y-10">
          {/* Timeline vertical line */}
          <div className="absolute top-0 left-5 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />

          {crossCreekHistory.map((item, index) => (
            <motion.div
              key={item.year}
              layout
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="relative pl-12"
            >
              <div
                onClick={() => setOpenYear(openYear === item.year ? null : item.year)}
                className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-xl shadow-md cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:scale-[1.02]"
              >
                <h2 className="text-2xl font-semibold text-gray-900">
                  {item.year} – {item.title}
                </h2>
                <p className="mt-2 text-gray-700">{item.description}</p>

                <AnimatePresence>
                  {openYear === item.year && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 list-disc list-inside space-y-1 text-gray-700"
                    >
                      {item.details?.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Timeline dot */}
              <motion.div
                className="absolute left-1 top-6 w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

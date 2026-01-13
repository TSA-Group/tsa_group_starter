// app/history/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaRocket,
  FaUsers,
  FaGlobe,
  FaLaptopCode,
  FaCogs,
} from "react-icons/fa";

export const metadata = {
  title: "History | Gatherly",
  description: "Timeline of milestones that shaped Gatherly",
};

type Milestone = {
  year: number;
  title: string;
  description: string;
  details?: string[];
  icon?: JSX.Element;
};

const historyData: Milestone[] = [
  {
    year: 2015,
    title: "Idea Born",
    description: "Gatherly concept is conceived.",
    details: [
      "Founder brainstorms app idea for community engagement",
      "Initial sketches and wireframes created",
    ],
    icon: <FaStar className="text-yellow-500 w-5 h-5 inline-block mr-2" />,
  },
  {
    year: 2016,
    title: "Team Formed",
    description: "First team members join.",
    details: [
      "Core developers onboarded",
      "Designers and UX specialists hired",
      "First planning meetings",
    ],
    icon: <FaUsers className="text-blue-500 w-5 h-5 inline-block mr-2" />,
  },
  {
    year: 2017,
    title: "Prototype Development",
    description: "Initial prototype built.",
    details: [
      "Basic features implemented",
      "Internal testing begins",
      "Feedback collected",
    ],
    icon: <FaLaptopCode className="text-green-500 w-5 h-5 inline-block mr-2" />,
  },
  {
    year: 2018,
    title: "Private Beta",
    description: "Limited beta testing with early users.",
    details: [
      "Collected user feedback",
      "Improved usability and interface",
      "Began marketing strategy",
    ],
    icon: <FaRocket className="text-red-500 w-5 h-5 inline-block mr-2" />,
  },
  {
    year: 2019,
    title: "First Launch",
    description: "Gatherly publicly launches.",
    details: [
      "Website goes live",
      "First 1000 users join",
      "Media coverage received",
    ],
    icon: <FaGlobe className="text-purple-500 w-5 h-5 inline-block mr-2" />,
  },
  {
    year: 2020,
    title: "Growth Phase",
    description: "Community grows rapidly.",
    details: [
      "10,000+ users onboarded",
      "New features added",
      "Mobile app development begins",
    ],
    icon: <FaCogs className="text-orange-500 w-5 h-5 inline-block mr-2" />,
  },
  {
    year: 2021,
    title: "Mobile App Launch",
    description: "iOS and Android apps released.",
    details: [
      "Smooth cross-platform experience",
      "Push notifications implemented",
      "Community engagement doubled",
    ],
  },
  {
    year: 2022,
    title: "Global Expansion",
    description: "Gatherly reaches international users.",
    details: [
      "New languages supported",
      "Server infrastructure scaled",
      "Community ambassadors recruited worldwide",
    ],
  },
  {
    year: 2023,
    title: "Major Redesign",
    description: "Website and app redesigned for modern UX.",
    details: [
      "New branding and color scheme",
      "Performance optimization",
      "Accessibility improvements",
    ],
  },
  {
    year: 2024,
    title: "Community Events",
    description: "First live events held.",
    details: [
      "Workshops and meetups organized",
      "Partnerships with local organizations",
      "User-generated content initiatives",
    ],
  },
  {
    year: 2025,
    title: "AI Integration",
    description: "AI tools integrated for personalized experiences.",
    details: [
      "Smart recommendations for events",
      "AI-powered community moderation",
      "Enhanced analytics for admins",
    ],
  },
  {
    year: 2026,
    title: "Future Plans",
    description: "Preparing for next-gen features.",
    details: [
      "VR/AR experiences in beta",
      "Global user base projected to double",
      "Focus on sustainability and accessibility",
    ],
  },
];

export default function HistoryPage() {
  const [openYear, setOpenYear] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white px-6 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight mb-6 text-gray-900">
          Our History
        </h1>
        <p className="text-sm text-neutral-600 mb-12">
          Explore the key milestones and achievements that shaped Gatherly over the years.
        </p>

        <div className="relative space-y-8">
          {/* Gradient vertical timeline line */}
          <div className="absolute top-0 left-5 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

          {historyData.map((item, index) => (
            <motion.div
              key={item.year}
              layout
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className={`relative pl-12`}
            >
              <div
                className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setOpenYear(openYear === item.year ? null : item.year)}
              >
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  {item.icon && item.icon} {item.year} – {item.title}
                </h2>
                <p className="mt-2 text-gray-700">{item.description}</p>

                <AnimatePresence>
                  {openYear === item.year && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 list-disc list-inside text-gray-700 space-y-1"
                    >
                      {item.details?.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated timeline dot */}
              <motion.div
                layout
                className="absolute left-1 top-6 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              ></motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

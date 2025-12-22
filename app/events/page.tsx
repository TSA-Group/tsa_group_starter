'use client';

import { useState } from 'react';

// Simple icon components using SVG
const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);

const MapPin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" strokeWidth="2" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" strokeWidth="2" />
    <path strokeWidth="2" d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path strokeWidth="2" d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polyline points="12 6 12 12 16 14" strokeWidth="2" />
  </svg>
);

const Heart = ({ className }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Share2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" strokeWidth="2" />
    <circle cx="6" cy="12" r="3" strokeWidth="2" />
    <circle cx="18" cy="19" r="3" strokeWidth="2" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="2" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="2" />
  </svg>
);

const Filter = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeWidth="2" />
  </svg>
);

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-indigo-500' },
    { id: 'community', name: 'Community Dinner', color: 'bg-blue-500' },
    { id: 'education', name: 'Education', color: 'bg-purple-500' },
    { id: 'food', name: 'Food Pantry', color: 'bg-green-500' },
    { id: 'cleanup', name: 'Cleanup', color: 'bg-yellow-500' },
    { id: 'tutoring', name: 'Tutoring', color: 'bg-pink-500' }
  ];

  const events = [
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
    },
    {
      id: 3,
      title: 'Food Bank Distribution',
      category: 'food',
      date: 'Dec 26, 2025',
      time: '9:00 AM - 2:00 PM',
      location: 'Houston Food Bank',
      address: '535 Portwall St, Houston, TX',
      attendees: 78,
      spots: 100,
      description: 'Volunteer to help sort and distribute food to families in need during the holiday season.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
      organizer: 'Houston Food Bank'
    },
    {
      id: 4,
      title: 'Brazos River Park Cleanup',
      category: 'cleanup',
      date: 'Dec 29, 2025',
      time: '8:00 AM - 12:00 PM',
      location: 'Brazos River Park',
      address: 'Brazos River Park Trail, Sugar Land, TX',
      attendees: 34,
      spots: 50,
      description: 'Join fellow community members in keeping our parks clean and beautiful for everyone to enjoy.',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
      organizer: 'Keep Houston Beautiful'
    },
    {
      id: 5,
      title: 'Math Tutoring for Middle School',
      category: 'tutoring',
      date: 'Dec 30, 2025',
      time: '3:30 PM - 5:30 PM',
      location: 'Sugarland Community Center',
      address: '226 Matlage Way, Sugar Land, TX',
      attendees: 18,
      spots: 25,
      description: 'Help middle school students excel in mathematics through personalized tutoring and support.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      organizer: 'Education First Houston'
    },
    {
      id: 6,
      title: 'Holiday Clothing Drive',
      category: 'community',
      date: 'Dec 27, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Richmond Community Hub',
      address: '1234 Richmond Ave, Houston, TX',
      attendees: 29,
      spots: 40,
      description: 'Collect and organize winter clothing donations for local families experiencing homelessness.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
      organizer: 'Houston Helping Hands'
    }
  ];

  const filteredEvents = events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  const toggleFavorite = (eventId) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Gatherly
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/map" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Resources
              </a>
              <a href="/events" className="text-indigo-400 font-semibold">
                Events
              </a>
              <a href="/contact" className="text-slate-300 hover:text-indigo-400 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-4">
            Upcoming Community Events
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover meaningful ways to connect with your community through volunteering, learning, and shared experiences.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="text-slate-400 w-5 h-5" />
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg scale-105`
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="mt-4 text-slate-400 text-sm">
            Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <button
                  onClick={() => toggleFavorite(event.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 backdrop-blur-sm hover:bg-slate-900 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(event.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    categories.find(c => c.id === event.category)?.color || 'bg-slate-600'
                  }`}>
                    {categories.find(c => c.id === event.category)?.name || event.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>{event.attendees} / {event.spots} spots filled</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(event.attendees / event.spots) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Register
                  </button>
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-slate-300" />
                  </button>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Organized by {event.organizer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
            <p className="text-slate-400">
              Try adjusting your filters to find more events.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Want to host your own event?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Create meaningful community experiences and bring people together.
          </p>
          <button className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 duration-200">
            Create an Event
          </button>
        </div>
      </section>
    </div>
  );
}

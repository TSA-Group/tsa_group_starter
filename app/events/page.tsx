import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Heart, Share2, Filter } from 'lucide-react';

export default function Page() {
  // Sample events data
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
    // ... add other events here
  ];

  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-indigo-500' },
    { id: 'community', name: 'Community Dinner', color: 'bg-blue-500' },
    { id: 'education', name: 'Education', color: 'bg-purple-500' },
    { id: 'food', name: 'Food Pantry', color: 'bg-green-500' },
    { id: 'cleanup', name: 'Cleanup', color: 'bg-yellow-500' },
    { id: 'tutoring', name: 'Tutoring', color: 'bg-pink-500' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Filters */}
      <div className="mb-8">
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
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
            {/* Event card content - see artifact for full code */}
          </div>
        ))}
      </div>
    </div>
  );
}

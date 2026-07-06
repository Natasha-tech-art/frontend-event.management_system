import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, Zap, ChevronRight } from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => { fetchEvents(); }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, location]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/events/categories/');
      setCategories(res.data);
    } catch (err) { console.error('Failed to load categories', err); }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (location) params.location = location;
      const res = await api.get('/events/', { params });
      setEvents(res.data.results || res.data);
    } catch (err) { console.error('Failed to load events', err); }
    finally { setLoading(false); }
  };

  const isFiltered = search || category || location;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <div className="relative bg-[#0B0B14] overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#FF2E63]/15 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-48 bg-[#22D3EE]/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF2E63]/10 border border-[#FF2E63]/20 text-[#FF2E63] text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Live · Local · Loud
          </div>

          <h1 className="font-display text-5xl sm:text-7xl text-white leading-[1.0] uppercase mb-5">
            Don't just attend.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E63] via-[#7C3AED] to-[#22D3EE] mt-1">
              Experience it.
            </span>
          </h1>

          <p className="text-white/50 max-w-md mx-auto mb-10 text-base leading-relaxed">
            Concerts, conferences, and festivals near you — grab your ticket before it's gone.
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 rounded-xl">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text" placeholder="Search events, artists, venues..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 rounded-xl sm:w-40">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text" placeholder="Location"
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
                />
              </div>

              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none text-gray-700 sm:w-40"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <button
                onClick={fetchEvents}
                className="flex items-center justify-center gap-2 bg-[#FF2E63] hover:bg-[#e0264f] text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-lg shadow-[#FF2E63]/30 text-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setCategory('')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${!category ? 'bg-[#0B0B14] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(category === cat.name ? '' : cat.name)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${category === cat.name ? 'bg-[#FF2E63] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-gray-900">
              {isFiltered ? 'Search Results' : 'Upcoming Events'}
            </h2>
            {!loading && (
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                {events.length} events
              </span>
            )}
          </div>
          {!isFiltered && (
            <button className="flex items-center gap-1 text-sm text-[#FF2E63] font-medium hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-video bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No events found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

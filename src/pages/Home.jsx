import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, Zap } from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import concertHero from '../assets/concert-hero.jpg';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, location]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/events/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
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
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HERO */}
      <div className="relative h-[560px] sm:h-[600px] overflow-hidden bg-stage-night">
        <img
          src={concertHero}
          alt="Concert crowd under stage lights"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stage-night/60 via-stage-night/40 to-stage-night" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ticket-red/20 via-transparent to-ticket-cyan/20" />

        <div className="absolute -top-16 -left-16 w-96 h-96 bg-ticket-violet/30 rounded-full blur-3xl" />
        <div className="absolute top-10 right-0 w-96 h-96 bg-ticket-cyan/20 rounded-full blur-3xl" />

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-ticket-amber uppercase mb-4">
            <Zap className="w-3.5 h-3.5" /> Live · Local · Loud
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-white leading-[1.05] uppercase">
            Don't just attend.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ticket-red via-ticket-violet to-ticket-cyan">
              Experience it.
            </span>
          </h1>
          <p className="text-white/70 mt-5 max-w-md font-medium">
            Concerts, conferences, and festivals near you — grab your ticket before it's gone.
          </p>

          <div className="mt-9 w-full max-w-3xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-black/40 p-3 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white/10 rounded-xl border border-white/10">
              <Search className="w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-sm bg-transparent text-white placeholder-white/50"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 bg-white/10 rounded-xl border border-white/10">
              <MapPin className="w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full sm:w-32 outline-none text-sm bg-transparent text-white placeholder-white/50"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm outline-none text-white [&>option]:text-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-extrabold text-stage-night">
            {search || category || location ? 'Search Results' : 'Upcoming Events'}
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No events found</p>
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
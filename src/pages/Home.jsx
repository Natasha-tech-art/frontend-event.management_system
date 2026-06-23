import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
        <p className="text-gray-500 mt-1">Find and book tickets to events happening near you</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
          <MapPin className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full sm:w-32 outline-none text-sm"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
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
  );
}
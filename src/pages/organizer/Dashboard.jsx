import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, DollarSign, CheckCircle, Plus, Edit, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/StatCard';

export default function OrganizerDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        api.get('/analytics/organizer/'),
        api.get('/events/my-events/'),
      ]);
      setStats(statsRes.data);
      setEvents(eventsRes.data.results || eventsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.post(`/events/${id}/publish/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = stats?.monthly_sales?.map((item) => ({
    month: item.month,
    bookings: item.total,
  })) || [];

  const statusStyles = {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    completed: 'bg-blue-50 text-blue-700',
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your events and track performance</p>
        </div>
        <Link
          to="/organizer/events/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Events" value={stats?.total_events ?? 0} icon={Calendar} color="indigo" />
        <StatCard label="Published" value={stats?.published_events ?? 0} icon={CheckCircle} color="green" />
        <StatCard label="Confirmed Bookings" value={stats?.total_bookings ?? 0} icon={Ticket} color="purple" />
        <StatCard label="Total Revenue" value={`KSh ${stats?.total_revenue ?? 0}`} icon={DollarSign} color="yellow" />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* My Events */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">My Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No events yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[event.status]}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {event.remaining_tickets}/{event.capacity} tickets left
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(event.id)}
                      className="text-sm font-medium text-green-600 hover:underline"
                    >
                      Publish
                    </button>
                  )}
                  <Link
                    to={`/organizer/events/${event.id}/analytics`}
                    className="text-gray-400 hover:text-indigo-600"
                    title="View Analytics"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/organizer/events/${event.id}/edit`}
                    className="text-gray-400 hover:text-indigo-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
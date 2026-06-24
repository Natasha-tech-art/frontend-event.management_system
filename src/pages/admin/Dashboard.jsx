import { useState, useEffect } from 'react';
import { Users, Calendar, Ticket, DollarSign, CheckCircle, Ban } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, usersRes] = await Promise.all([
        api.get('/analytics/admin/'),
        api.get('/events/admin/all/'),
        api.get('/users/admin/users/'),
      ]);
      setStats(statsRes.data);
      setEvents(eventsRes.data.results || eventsRes.data);
      setUsers(usersRes.data.results || usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/events/admin/${id}/approve/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/users/admin/users/${user.id}/`, { is_active: !user.is_active });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const statusStyles = {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    completed: 'bg-blue-50 text-blue-700',
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading admin dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Platform-wide overview and management</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.total_users ?? 0} icon={Users} color="indigo" />
        <StatCard label="Total Events" value={stats?.total_events ?? 0} icon={Calendar} color="purple" />
        <StatCard label="Confirmed Bookings" value={stats?.total_bookings ?? 0} icon={Ticket} color="green" />
        <StatCard label="Total Revenue" value={`KSh ${stats?.total_revenue ?? 0}`} icon={DollarSign} color="yellow" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
            activeTab === 'events' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
            activeTab === 'users' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Users
        </button>
      </div>

      {/* Events tab */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">No events found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">by {event.organizer_name}</p>
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1.5 ${statusStyles[event.status]}`}>
                      {event.status}
                    </span>
                  </div>
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handleApprove(event.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:underline"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Publish
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">No users found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-medium text-gray-900">{u.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                    <span className="inline-block text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full mt-1.5 capitalize">
                      {u.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleActive(u)}
                    className={`flex items-center gap-1.5 text-sm font-medium hover:underline ${
                      u.is_active ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {u.is_active ? (
                      <>
                        <Ban className="w-4 h-4" /> Suspend
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Activate
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
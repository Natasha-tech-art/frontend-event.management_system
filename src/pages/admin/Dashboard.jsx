import { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, Ticket, DollarSign, CheckCircle, Ban, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/events/admin/${id}/approve/`);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (user) => {
    setActionLoading(user.id);
    try {
      await api.put(`/users/admin/users/${user.id}/`, { is_active: !user.is_active });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingEvents = events.filter(e => e.status === 'draft');
  const allEvents = events;

  const statusConfig = {
    draft:     { label: 'Pending Approval', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    published: { label: 'Published',        className: 'bg-green-50 text-green-700 border border-green-200' },
    cancelled: { label: 'Cancelled',        className: 'bg-red-50 text-red-700 border border-red-200' },
    completed: { label: 'Completed',        className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  };

  const tabs = [
    { key: 'pending', label: 'Pending Approval', count: pendingEvents.length, icon: Clock },
    { key: 'events',  label: 'All Events',        count: allEvents.length,    icon: Calendar },
    { key: 'users',   label: 'Users',             count: users.length,        icon: Users },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Loading admin dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform-wide overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users"        value={stats?.total_users ?? 0}                     icon={Users}      color="indigo" />
          <StatCard label="Total Events"       value={stats?.total_events ?? 0}                    icon={Calendar}   color="purple" />
          <StatCard label="Confirmed Bookings" value={stats?.total_bookings ?? 0}                  icon={Ticket}     color="green"  />
          <StatCard label="Total Revenue"      value={`KSh ${stats?.total_revenue ?? 0}`}          icon={DollarSign} color="yellow" />
        </div>

        {/* Pending banner */}
        {pendingEvents.length > 0 && activeTab !== 'pending' && (
          <div
            onClick={() => setActiveTab('pending')}
            className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 cursor-pointer hover:bg-amber-100 transition"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {pendingEvents.length} event{pendingEvents.length > 1 ? 's' : ''} waiting for your approval
            </p>
            <span className="ml-auto text-xs text-amber-600 font-semibold">Review →</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {tabs.map(({ key, label, count, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  key === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pending approval tab */}
        {activeTab === 'pending' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {pendingEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-500 font-medium">All caught up!</p>
                <p className="text-gray-400 text-sm mt-1">No events waiting for approval</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="flex items-start justify-between p-5 gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {event.banner ? (
                        <img src={event.banner} alt={event.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">by {event.organizer_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {' · '}{event.venue}, {event.location}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          KSh {Number(event.ticket_price).toLocaleString()} · Capacity: {event.capacity}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApprove(event.id)}
                      disabled={actionLoading === event.id}
                      className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50 shadow-sm shadow-green-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {actionLoading === event.id ? 'Approving...' : 'Approve & Publish'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All events tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {allEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No events found</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {allEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-5 gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {event.banner ? (
                        <img src={event.banner} alt={event.title} className="w-14 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">by {event.organizer_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[event.status]?.className || 'bg-gray-100 text-gray-600'}`}>
                        {statusConfig[event.status]?.label || event.status}
                      </span>
                      {event.status === 'draft' && (
                        <button
                          onClick={() => handleApprove(event.id)}
                          disabled={actionLoading === event.id}
                          className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No users found</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF2E63] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{u.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{u.name}</h3>
                        <p className="text-xs text-gray-400">{u.email}</p>
                        <span className="inline-block text-xs font-semibold bg-[#7C3AED]/10 text-[#7C3AED] px-2 py-0.5 rounded-full mt-1 capitalize">
                          {u.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(u)}
                      disabled={actionLoading === u.id}
                      className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50 ${
                        u.is_active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {u.is_active ? <><Ban className="w-4 h-4" /> Suspend</> : <><CheckCircle className="w-4 h-4" /> Activate</>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

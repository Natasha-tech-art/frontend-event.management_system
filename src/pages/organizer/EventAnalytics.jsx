import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ticket, Users, DollarSign, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/StatCard';

export default function EventAnalytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`/analytics/event/${id}/`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="text-center py-20 text-gray-400">No data available</div>;
  }

  const pieData = [
    { name: 'Booked', value: data.tickets_booked },
    { name: 'Remaining', value: data.tickets_remaining },
  ];
  const COLORS = ['#6366f1', '#e5e7eb'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        to="/organizer/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.event}</h1>
      <p className="text-gray-500 mb-6">Event performance overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Tickets Booked" value={data.tickets_booked} icon={Ticket} color="indigo" />
        <StatCard label="Checked In" value={data.checked_in} icon={CheckCircle} color="green" />
        <StatCard label="Capacity" value={data.total_capacity} icon={Users} color="purple" />
        <StatCard label="Revenue" value={`KSh ${data.revenue}`} icon={DollarSign} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Ticket Occupancy</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-bold text-gray-900 mt-2">
            {data.occupancy_rate}
          </p>
          <p className="text-center text-sm text-gray-500">Occupancy rate</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Capacity</span>
              <span className="font-medium text-gray-900">{data.total_capacity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tickets Sold</span>
              <span className="font-medium text-gray-900">{data.tickets_booked}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tickets Remaining</span>
              <span className="font-medium text-gray-900">{data.tickets_remaining}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Attendees Checked In</span>
              <span className="font-medium text-gray-900">{data.checked_in}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-bold text-gray-900">KSh {data.revenue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
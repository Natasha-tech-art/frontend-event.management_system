import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, X } from 'lucide-react';
import api from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/');
      setBookings(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancellingId(id);
    try {
      await api.post(`/bookings/${id}/cancel/`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">You haven't booked any events yet</p>
          <Link to="/" className="text-indigo-600 text-sm font-medium hover:underline mt-2 inline-block">
            Browse events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.event_title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(booking.event_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    {booking.event_venue}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {booking.ticket_quantity} ticket(s) · KSh {booking.total_amount}
                </div>

                <div className="flex items-center gap-3">
                  {booking.status === 'pending' && (
                    <>
                      <Link
                        to={`/checkout/${booking.id}`}
                        className="text-sm font-medium text-indigo-600 hover:underline"
                      >
                        Pay Now
                      </Link>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <Link
                      to={`/ticket/${booking.id}`}
                      className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      View Ticket
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
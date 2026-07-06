import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, ArrowLeft, Users, Clock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchEvent(); fetchReviews(); }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}/`);
      setEvent(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/event/${id}/`);
      setReviews(res.data);
    } catch (err) { console.error(err); }
  };

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    setError('');
    setBooking(true);
    try {
      const res = await api.post('/bookings/create/', { event: id, ticket_quantity: quantity });
      navigate(`/checkout/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Booking failed');
    } finally { setBooking(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center">
      <div className="text-white/40 animate-pulse">Loading event...</div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center">
      <div className="text-white/40">Event not found</div>
    </div>
  );

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  const total = (event.ticket_price * quantity).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="relative h-72 sm:h-96 bg-gradient-to-br from-[#0B0B14] to-[#15131F] overflow-hidden">
        {event.banner ? (
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-20 h-20 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14]/60 to-transparent" />

        <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2">
            {event.category_name && (
              <span className="inline-block bg-[#FF2E63] text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                {event.category_name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{event.title}</h1>

            <div className="flex flex-wrap gap-4 mt-5">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
                <Calendar className="w-4 h-4 text-[#FF2E63]" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
                <MapPin className="w-4 h-4 text-[#7C3AED]" />
                {event.venue}, {event.location}
              </div>
              {avgRating && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
                  <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                  <span className="font-semibold text-gray-800">{avgRating}</span>
                  <span className="text-gray-400">({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#FF2E63] inline-block" />
                About this event
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-400">
                <Users className="w-4 h-4" /> Organised by <span className="text-gray-700 font-medium">{event.organizer_name}</span>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#FBBF24] inline-block" />
                  Reviews
                </h2>
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">{review.user_name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-sm text-gray-600 mt-1.5">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking card */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 overflow-hidden">
              {/* Price header */}
              <div className="bg-gradient-to-br from-[#0B0B14] to-[#15131F] p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">
                    {event.ticket_price > 0 ? `KSh ${Number(event.ticket_price).toLocaleString()}` : 'Free'}
                  </span>
                  {event.ticket_price > 0 && <span className="text-white/40 text-sm">per ticket</span>}
                </div>
                <div className={`flex items-center gap-1.5 mt-2 text-sm font-medium ${event.is_full ? 'text-[#FF2E63]' : 'text-[#22D3EE]'}`}>
                  <Ticket className="w-4 h-4" />
                  {event.is_full ? 'Sold out' : `${event.remaining_tickets} tickets remaining`}
                </div>
              </div>

              <div className="p-5">
                {!event.is_full && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#7C3AED] transition bg-gray-50"
                    >
                      {[...Array(Math.min(10, event.remaining_tickets))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} ticket{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={event.is_full || booking || (user && user.role !== 'attendee')}
                  className="w-full bg-[#FF2E63] hover:bg-[#e0264f] text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-[#FF2E63]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {event.is_full ? 'Sold Out'
                    : user && user.role !== 'attendee' ? 'Only attendees can book'
                    : booking ? 'Booking...' : 'Book Now →'}
                </button>

                {event.ticket_price > 0 && !event.is_full && (
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-1">
                    <span>Total</span>
                    <span className="font-bold text-gray-700">KSh {total}</span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  Tickets confirmed instantly via M-Pesa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

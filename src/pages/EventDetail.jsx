import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    fetchEvent();
    fetchReviews();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}/`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/event/${id}/`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setBooking(true);
    try {
      const res = await api.post('/bookings/create/', {
        event: id,
        ticket_quantity: quantity,
      });
      navigate(`/checkout/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-gray-400">Event not found</div>;
  }

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to events
      </Link>

      <div className="aspect-[3/1] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl overflow-hidden mb-8">
        {event.banner ? (
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white/50" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {event.category_name && (
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
              {event.category_name}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4" />
              {event.venue}, {event.location}
            </div>
            {avgRating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {avgRating} ({reviews.length} reviews)
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">About this event</h2>
            <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
          </div>

          <p className="text-sm text-gray-500 mt-4">Organized by {event.organizer_name}</p>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-10">
              <h2 className="font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{review.user_name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking card */}
        <div>
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {event.ticket_price > 0 ? `KSh ${event.ticket_price}` : 'Free'}
              </span>
              <span className="text-sm text-gray-500">per ticket</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <Ticket className="w-4 h-4" />
              {event.is_full ? 'Sold out' : `${event.remaining_tickets} tickets remaining`}
            </div>

            {!event.is_full && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                >
                  {[...Array(Math.min(10, event.remaining_tickets))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
            )}

            <button
              onClick={handleBooking}
              disabled={event.is_full || booking || (user && user.role !== 'attendee')}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {event.is_full
                ? 'Sold Out'
                : user && user.role !== 'attendee'
                ? 'Only attendees can book'
                : booking
                ? 'Booking...'
                : 'Book Now'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Total: KSh {(event.ticket_price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
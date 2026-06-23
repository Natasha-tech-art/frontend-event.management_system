import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | waiting | success | failed
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}/`);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      await api.post('/payments/initiate/', {
        booking_id: bookingId,
        phone_number: phone,
      });
      setStatus('waiting');
      pollPaymentStatus();
    } catch (err) {
      setStatus('failed');
      setError(err.response?.data?.error || 'Failed to initiate payment');
    }
  };

  const pollPaymentStatus = () => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const res = await api.get(`/payments/status/${bookingId}/`);
        if (res.data.status === 'completed') {
          clearInterval(interval);
          setStatus('success');
        } else if (res.data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed');
          setError('Payment was not completed. Please try again.');
        }
      } catch (err) {
        // booking might not have a payment record yet, ignore
      }

      if (attempts >= 20) {
        clearInterval(interval);
        setStatus('failed');
        setError('Payment timed out. Please check your phone and try again.');
      }
    }, 3000);
  };

  if (!booking) {
    return <div className="text-center py-20 text-gray-400">Loading booking...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Complete your payment</h1>
        <p className="text-sm text-gray-500 mb-6">via M-Pesa</p>

        {/* Booking summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Event</span>
            <span className="font-medium text-gray-900">{booking.event_title}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Tickets</span>
            <span className="font-medium text-gray-900">{booking.ticket_quantity}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-gray-900">KSh {booking.total_amount}</span>
          </div>
        </div>

        {status === 'idle' && (
          <form onSubmit={handlePay}>
            <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg mb-4">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <input
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Pay KSh {booking.total_amount}
            </button>
          </form>
        )}

        {status === 'sending' && (
          <div className="text-center py-6">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Sending payment request...</p>
          </div>
        )}

        {status === 'waiting' && (
          <div className="text-center py-6">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900">Check your phone</p>
            <p className="text-sm text-gray-500 mt-1">Enter your M-Pesa PIN to complete payment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-medium text-gray-900">Payment successful!</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Your ticket is ready</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              View My Tickets
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-6">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="font-medium text-gray-900">Payment failed</p>
            <p className="text-sm text-red-500 mt-1 mb-4">{error}</p>
            <button
              onClick={() => setStatus('idle')}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, ArrowLeft, Download } from 'lucide-react';
import api from '../services/api';

export default function TicketView() {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    generateOrFetchTicket();
  }, [bookingId]);

  const generateOrFetchTicket = async () => {
    try {
      const res = await api.post(`/tickets/generate/${bookingId}/`);
      setTicket(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load ticket');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <Link to="/my-bookings" className="text-indigo-600 text-sm font-medium hover:underline mt-3 inline-block">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Link to="/my-bookings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to bookings
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
          <h1 className="text-xl font-bold">{ticket.event_title}</h1>
          <div className="flex items-center gap-1.5 text-sm text-white/80 mt-2">
            <Calendar className="w-4 h-4" />
            {new Date(ticket.event_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-white/80 mt-1">
            <MapPin className="w-4 h-4" />
            {ticket.event_venue}
          </div>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="p-4 bg-white border-2 border-gray-100 rounded-xl">
            <QRCodeSVG value={ticket.ticket_ref} size={180} />
          </div>

          <p className="font-mono text-sm text-gray-500 mt-4">{ticket.ticket_ref}</p>

          <div className="w-full mt-6 pt-6 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Attendee</span>
              <span className="font-medium text-gray-900">{ticket.attendee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium text-gray-900">{ticket.quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${ticket.checked_in ? 'text-green-600' : 'text-gray-900'}`}>
                {ticket.checked_in ? 'Checked In' : 'Not Checked In'}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            Show this QR code at the entrance for check-in
          </p>
        </div>
      </div>
    </div>
  );
}
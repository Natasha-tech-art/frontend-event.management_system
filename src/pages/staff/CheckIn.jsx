import { useState } from 'react';
import { QrCode, CheckCircle2, XCircle, Search } from 'lucide-react';
import api from '../../services/api';

export default function CheckIn() {
  const [ticketRef, setTicketRef] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await api.post('/tickets/checkin/', { ticket_ref: ticketRef });
      setResult(res.data);
      setTicketRef('');
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-7 h-7 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Check In Attendee</h1>
        <p className="text-gray-500 mt-1">Enter or scan the ticket reference code</p>
      </div>

      <form onSubmit={handleCheckIn} className="bg-white rounded-2xl border border-gray-100 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Reference</label>
        <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg mb-4">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="EVT-3-A1B2C3D4"
            value={ticketRef}
            onChange={(e) => setTicketRef(e.target.value)}
            required
            className="w-full outline-none text-sm font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check In'}
        </button>
      </form>

      {/* Success */}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-semibold text-gray-900">{result.message}</p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Attendee:</span> {result.attendee}</p>
            <p><span className="font-medium">Event:</span> {result.event}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="font-semibold text-gray-900">{error}</p>
        </div>
      )}
    </div>
  );
}
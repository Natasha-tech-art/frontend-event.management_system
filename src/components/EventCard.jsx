import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';

export default function EventCard({ event }) {
  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/50" />
          </div>
        )}
        {event.category_name && (
          <span className="absolute top-3 left-3 bg-white/90 text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">
            {event.category_name}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition truncate">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{event.venue}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900">
            {event.ticket_price > 0 ? `KSh ${event.ticket_price}` : 'Free'}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Ticket className="w-3.5 h-3.5" />
            {event.remaining_tickets > 0 ? `${event.remaining_tickets} left` : 'Sold out'}
          </div>
        </div>
      </div>
    </Link>
  );
}
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const categoryAccents = {
  Entertainment: 'bg-ticket-red',
  Tech: 'bg-ticket-cyan',
  Sports: 'bg-ticket-amber',
  Workshops: 'bg-ticket-violet',
};

export default function EventCard({ event }) {
  const accent = categoryAccents[event.category_name] || 'bg-ticket-violet';

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-stage-night/10 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Accent strip = the "ticket" color tab */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${accent}`} />

      <div className="aspect-video bg-gradient-to-br from-stage-night to-stage-panel relative overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-white/30" />
          </div>
        )}
        {event.category_name && (
          <span className={`absolute top-3 left-4 text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full ${accent}`}>
            {event.category_name}
          </span>
        )}

        {/* Perforated "tear" edge between image and details */}
        <div className="absolute -bottom-2 left-0 w-full h-4 bg-white rounded-t-full" />
      </div>

      <div className="p-4 pl-5">
        <h3 className="font-bold text-gray-900 group-hover:text-ticket-violet transition truncate">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{event.venue}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
          <span className="font-extrabold text-stage-night">
            {event.ticket_price > 0 ? `KSh ${event.ticket_price}` : 'FREE'}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <Ticket className="w-3.5 h-3.5" />
            {event.remaining_tickets > 0 ? `${event.remaining_tickets} left` : 'Sold out'}
          </div>
        </div>
      </div>
    </Link>
  );
}
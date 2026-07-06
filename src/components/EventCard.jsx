import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, TrendingUp } from 'lucide-react';

const categoryConfig = {
  Entertainment: { bg: 'bg-[#FF2E63]', text: 'text-[#FF2E63]', glow: 'shadow-[#FF2E63]/20' },
  Tech:          { bg: 'bg-[#22D3EE]', text: 'text-[#22D3EE]', glow: 'shadow-[#22D3EE]/20' },
  Sports:        { bg: 'bg-[#FBBF24]', text: 'text-[#FBBF24]', glow: 'shadow-[#FBBF24]/20' },
  Workshops:     { bg: 'bg-[#7C3AED]', text: 'text-[#7C3AED]', glow: 'shadow-[#7C3AED]/20' },
};

export default function EventCard({ event }) {
  const config = categoryConfig[event.category_name] || categoryConfig.Workshops;

  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const isSoldOut = event.remaining_tickets === 0;
  const isAlmostGone = event.remaining_tickets > 0 && event.remaining_tickets <= 10;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image area */}
      <div className="aspect-video bg-gradient-to-br from-[#0B0B14] to-[#15131F] relative overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-white/20" />
          </div>
        )}

        {/* Category badge */}
        {event.category_name && (
          <span className={`absolute top-3 left-3 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${config.bg}`}>
            {event.category_name}
          </span>
        )}

        {/* Sold out / almost gone badge */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest uppercase">Sold Out</span>
          </div>
        )}
        {isAlmostGone && !isSoldOut && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#FBBF24] text-[#0B0B14] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> Almost Gone
          </span>
        )}

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className={`font-bold text-gray-900 group-hover:${config.text} transition-colors truncate text-base`}>
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{event.venue}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="font-extrabold text-gray-900 text-sm">
            {event.ticket_price > 0 ? (
              <>
                <span className="text-xs font-medium text-gray-400 mr-1">From</span>
                KSh {Number(event.ticket_price).toLocaleString()}
              </>
            ) : (
              <span className={`${config.text} font-bold`}>FREE</span>
            )}
          </span>

          <div className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-50 ${isSoldOut ? 'text-gray-400' : config.text}`}>
            <Ticket className="w-3 h-3" />
            {isSoldOut ? 'Sold out' : `${event.remaining_tickets} left`}
          </div>
        </div>
      </div>
    </Link>
  );
}

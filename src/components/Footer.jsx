import { Link } from 'react-router-dom';
import { Ticket, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B14] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2E63] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#FF2E63]/30">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-white text-lg">Event<span className="text-[#FF2E63]">Hub</span></span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Kenya's platform for discovering and hosting unforgettable live events.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a key={href + Icon.displayName} href={href}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Events', to: '/' },
                { label: 'Concerts', to: '/?category=Entertainment' },
                { label: 'Tech Events', to: '/?category=Tech' },
                { label: 'Sports', to: '/?category=Sports' },
                { label: 'Workshops', to: '/?category=Workshops' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-white/40 hover:text-white text-sm transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Organizers</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Create an Event', to: '/organizer/events/new' },
                { label: 'Organizer Dashboard', to: '/organizer/dashboard' },
                { label: 'Event Analytics', to: '/organizer/dashboard' },
                { label: 'Sign Up as Organizer', to: '/register' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-white/40 hover:text-white text-sm transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Help Centre', to: '#' },
                { label: 'Contact Us', to: '#' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-white/40 hover:text-white text-sm transition">{label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-white/60 text-xs font-medium mb-1">M-Pesa Payments</p>
              <p className="text-white/30 text-xs">All transactions are processed securely via Safaricom Daraja API.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} EventHub. Built in Kenya 🇰🇪</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-white/25 hover:text-white/50 text-xs transition">Privacy</Link>
            <Link to="#" className="text-white/25 hover:text-white/50 text-xs transition">Terms</Link>
            <Link to="#" className="text-white/25 hover:text-white/50 text-xs transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

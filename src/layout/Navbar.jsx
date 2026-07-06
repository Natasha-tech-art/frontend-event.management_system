import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashLink =
    user?.role === 'organizer' ? '/organizer/dashboard' :
    user?.role === 'admin'     ? '/admin/dashboard' :
    user?.role === 'staff'     ? '/staff/checkin' : '/my-bookings';

  const dashLabel =
    user?.role === 'organizer' ? 'Dashboard' :
    user?.role === 'admin'     ? 'Admin' :
    user?.role === 'staff'     ? 'Check-in' : 'My Bookings';

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0B14]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2E63] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#FF2E63]/30">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white text-lg tracking-tight">Event<span className="text-[#FF2E63]">Hub</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/" className="text-sm text-white/60 hover:text-white transition font-medium">
              Browse Events
            </Link>

            {user ? (
              <>
                <Link to={dashLink} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition font-medium">
                  <LayoutDashboard className="w-4 h-4" />
                  {dashLabel}
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF2E63] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/80">{user.name}</span>
                  <button onClick={handleLogout} className="text-white/40 hover:text-[#FF2E63] transition" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition">
                  Log In
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-[#FF2E63] text-white px-4 py-2 rounded-full hover:bg-[#e0264f] transition shadow-lg shadow-[#FF2E63]/30">
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="sm:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-[#0B0B14] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white">Browse Events</Link>
          {user ? (
            <>
              <Link to={dashLink} onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white">{dashLabel}</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-sm text-[#FF2E63]">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white">Log In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-[#FF2E63]">Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

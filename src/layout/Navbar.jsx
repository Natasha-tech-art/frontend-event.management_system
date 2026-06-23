import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-lg text-gray-900">EventHub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Browse Events
            </Link>

            {user ? (
              <>
                {user.role === 'organizer' && (
                  <Link
                    to="/organizer/dashboard"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                {user.role === 'staff' && (
                  <Link
                    to="/staff/checkin"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Check-in
                  </Link>
                )}
                {user.role === 'attendee' && (
                  <Link
                    to="/my-bookings"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition"
                  >
                    My Bookings
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
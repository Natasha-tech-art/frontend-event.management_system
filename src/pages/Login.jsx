import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0B14]">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#0B0B14] via-[#15131F] to-[#0B0B14] p-12 border-r border-white/10 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF2E63]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2E63] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#FF2E63]/30">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-white text-xl">Event<span className="text-[#FF2E63]">Hub</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl text-white leading-tight">
            Your next<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E63] to-[#7C3AED]">
              unforgettable
            </span><br />
            experience awaits.
          </h2>
          <p className="text-white/50 mt-4 text-sm leading-relaxed">
            Discover concerts, conferences, and festivals happening near you. One platform, every ticket.
          </p>
        </div>

        <p className="text-white/20 text-xs relative z-10">© 2025 EventHub. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2E63] to-[#7C3AED] flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white text-lg">Event<span className="text-[#FF2E63]">Hub</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/40 mb-8 text-sm">Log in to your EventHub account</p>

          {error && (
            <div className="mb-5 p-3.5 bg-[#FF2E63]/10 border border-[#FF2E63]/20 text-[#FF2E63] text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#FF2E63]/60 focus:bg-white/8 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#FF2E63]/60 transition"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#FF2E63] hover:bg-[#e0264f] text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-[#FF2E63]/30 disabled:opacity-50 mt-2"
            >
              {loading ? 'Logging in...' : (<>Log In <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF2E63] font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

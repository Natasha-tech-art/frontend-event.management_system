import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      const errors = err.response?.data;
      const firstError = errors ? Object.values(errors)[0] : null;
      setError(Array.isArray(firstError) ? firstError[0] : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'attendee', label: '🎟 Attendee', desc: 'Discover and book events' },
    { value: 'organizer', label: '🎤 Organizer', desc: 'Create and manage events' },
  ];

  return (
    <div className="min-h-screen flex bg-[#0B0B14]">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#0B0B14] via-[#15131F] to-[#0B0B14] p-12 border-r border-white/10 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF2E63]/20 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2E63] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#FF2E63]/30">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-white text-xl">Event<span className="text-[#FF2E63]">Hub</span></span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-4xl text-white leading-tight">
            Join thousands<br />
            of event<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]">enthusiasts.</span>
          </h2>
          <div className="space-y-3">
            {['Book tickets in seconds', 'M-Pesa payments built-in', 'QR check-in at the door'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                </div>
                <span className="text-white/50 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative z-10">© 2025 EventHub. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 lg:hidden mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2E63] to-[#7C3AED] flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-white text-lg">Event<span className="text-[#FF2E63]">Hub</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-white/40 mb-8 text-sm">Join EventHub — it's free</p>

          {error && (
            <div className="mb-5 p-3.5 bg-[#FF2E63]/10 border border-[#FF2E63]/20 text-[#FF2E63] text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {roles.map((r) => (
                <button
                  key={r.value} type="button"
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  className={`p-3 rounded-xl border text-left transition ${
                    formData.role === r.value
                      ? 'border-[#7C3AED] bg-[#7C3AED]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{r.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  placeholder="Jane Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#7C3AED]/60 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#7C3AED]/60 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#7C3AED]/60 transition"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2E63] to-[#7C3AED] hover:opacity-90 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-[#7C3AED]/30 disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF2E63] font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

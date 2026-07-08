import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImagePlus, X, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import api from '../../services/api';

export default function EventForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', category: '',
    venue: '', location: '', start_date: '',
    end_date: '', ticket_price: '', capacity: '',
  });

  useEffect(() => {
    api.get('/events/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
    if (isEditing) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}/`);
      const e = res.data;
      setFormData({
        title: e.title, description: e.description,
        category: e.category || '', venue: e.venue,
        location: e.location, start_date: e.start_date?.slice(0, 16),
        end_date: e.end_date?.slice(0, 16), ticket_price: e.ticket_price,
        capacity: e.capacity,
      });
      if (e.banner) setBannerPreview(e.banner);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, key === 'start_date' || key === 'end_date'
        ? new Date(value).toISOString() : value);
    });
    if (bannerFile) data.append('banner', bannerFile);
    try {
      if (isEditing) {
        await api.put(`/events/${id}/update/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/events/create/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/organizer/dashboard');
    } catch (err) {
      const errors = err.response?.data;
      const first = errors ? Object.values(errors)[0] : null;
      setError(Array.isArray(first) ? first[0] : 'Failed to save event');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Loading event...</div>
    </div>
  );

  const fieldClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing ? 'Update your event details below' : 'Fill in the details — your event will be reviewed before going live'}
          </p>
        </div>

        {/* Approval notice */}
        {!isEditing && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
            <div className="w-5 h-5 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-sm text-amber-800">
              New events are reviewed by an admin before they appear publicly. You'll see it in your dashboard as <strong>Pending Approval</strong> until approved.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Banner upload */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <label className={labelClass}>Event Banner Image</label>
            {bannerPreview ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => { setBannerFile(null); setBannerPreview(null); }}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-black/80 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {bannerFile ? bannerFile.name : 'Current banner'}
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-[#7C3AED]/10 flex items-center justify-center transition">
                  <ImagePlus className="w-7 h-7 text-gray-400 group-hover:text-[#7C3AED] transition" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-[#7C3AED] transition">Click to upload a banner image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB · Recommended 1280×720</p>
                </div>
                <input type="file" accept="image/*" onChange={handleBannerSelect} className="hidden" />
              </label>
            )}
          </div>

          {/* Basic details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Basic Details</h3>

            <div>
              <label className={labelClass}>Event Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required
                placeholder="e.g. Nairobi Tech Summit 2025" className={fieldClass} />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4}
                placeholder="Tell attendees what this event is about..."
                className={`${fieldClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className={fieldClass}>
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF2E63]" /> Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Venue</label>
                <input name="venue" value={formData.venue} onChange={handleChange} required
                  placeholder="KICC" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>City / Area</label>
                <input name="location" value={formData.location} onChange={handleChange} required
                  placeholder="Nairobi CBD" className={fieldClass} />
              </div>
            </div>
          </div>

          {/* Date & time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7C3AED]" /> Date & Time
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date & Time</label>
                <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} required className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>End Date & Time</label>
                <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} required className={fieldClass} />
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#22D3EE]" /> Tickets & Capacity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ticket Price (KSh)</label>
                <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required
                  placeholder="500 (enter 0 for free)" className={fieldClass} min="0" />
              </div>
              <div>
                <label className={labelClass}>Total Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required
                  placeholder="200" className={fieldClass} min="1" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving}
            className="w-full bg-gradient-to-r from-[#FF2E63] to-[#7C3AED] hover:opacity-90 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Event' : 'Submit Event for Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

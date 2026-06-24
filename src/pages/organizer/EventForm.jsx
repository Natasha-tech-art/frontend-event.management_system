 import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import api from '../../services/api';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';

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
    title: '',
    description: '',
    category: '',
    venue: '',
    location: '',
    start_date: '',
    end_date: '',
    ticket_price: '',
    capacity: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) fetchEvent();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/events/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}/`);
      const event = res.data;
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category || '',
        venue: event.venue,
        location: event.location,
        start_date: event.start_date?.slice(0, 16),
        end_date: event.end_date?.slice(0, 16),
        ticket_price: event.ticket_price,
        capacity: event.capacity,
      });
      if (event.banner) setBannerPreview(event.banner);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'start_date' || key === 'end_date') {
        data.append(key, new Date(value).toISOString());
      } else {
        data.append(key, value);
      }
    });
    if (bannerFile) {
      data.append('banner', bannerFile);
    }

    try {
      if (isEditing) {
        await api.put(`/events/${id}/update/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/events/create/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/organizer/dashboard');
    } catch (err) {
      const errors = err.response?.data;
      const firstKey = errors ? Object.keys(errors)[0] : null;
      const firstError = firstKey ? errors[firstKey] : null;
      setError(Array.isArray(firstError) ? firstError[0] : 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading event...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stage-night mb-1">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h1>
      <p className="text-gray-500 mb-6">
        {isEditing ? 'Update your event details' : 'Fill in the details to create a new event'}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6">
        {/* Banner upload */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Banner</label>
        {bannerPreview ? (
          <div className="relative mb-4 rounded-xl overflow-hidden aspect-video bg-gray-100">
            <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeBanner}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="mb-4 flex flex-col items-center justify-center gap-2 aspect-video rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-ticket-violet hover:text-ticket-violet transition cursor-pointer">
            <ImagePlus className="w-8 h-8" />
            <span className="text-sm font-medium">Click to upload a banner image</span>
            <input type="file" accept="image/*" onChange={handleBannerSelect} className="hidden" />
          </label>
        )}

        <Input
          label="Event Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nairobi Tech Summit"
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell attendees what this event is about..."
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ticket-violet"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="KICC"
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Nairobi CBD"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date & Time"
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
          <Input
            label="End Date & Time"
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ticket Price (KSh)"
            type="number"
            name="ticket_price"
            value={formData.ticket_price}
            onChange={handleChange}
            placeholder="500"
          />
          <Input
            label="Capacity"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="200"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-stage-night text-white py-2.5 rounded-lg font-bold hover:bg-ticket-violet transition disabled:opacity-50 mt-2"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
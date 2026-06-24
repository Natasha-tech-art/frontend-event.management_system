import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './pages/EventDetail';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import TicketView from './pages/TicketView';
import OrganizerDashboard from './pages/organizer/Dashboard';
import EventForm from './pages/organizer/EventForm';
import EventAnalytics from './pages/organizer/EventAnalytics';
import CheckIn from './pages/staff/CheckIn';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/checkout/:bookingId" element={<Checkout />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/ticket/:bookingId" element={<TicketView />} />
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/create"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <EventForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <EventForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/analytics"
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <EventAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/checkin"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <CheckIn />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
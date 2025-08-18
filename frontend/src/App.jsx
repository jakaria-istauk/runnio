import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import UserDashboard from './pages/UserDashboard'
import MyEvents from './pages/MyEvents'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import UserManagement from './pages/admin/UserManagement'
import EventManagement from './pages/admin/EventManagement'
import RegistrationManagement from './pages/admin/RegistrationManagement'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const location = useLocation()
  const isDashboardRoute = location.pathname.startsWith('/dashboard')

  return (
    <div className="App">
      {!isDashboardRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          {/* User Dashboard Routes */}
          <Route
            path="/dashboard/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Admin Dashboard Routes */}
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/events"
            element={
              <ProtectedRoute requireAdmin>
                <EventManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/registrations"
            element={
              <ProtectedRoute requireAdmin>
                <RegistrationManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App

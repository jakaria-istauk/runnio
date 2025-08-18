import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, formatDateTime, formatTime } from '../utils/dateUtils'
import DashboardLayout from '../components/DashboardLayout'
import Icon from '../components/Icon'

const UserDashboard = () => {
  const { user, isAdmin } = useAuth()
  const [registrations, setRegistrations] = useState({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('upcoming')
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    activeEvents: 0
  })

  useEffect(() => {
    fetchRegistrations()
    if (isAdmin) {
      fetchAdminStats()
    }
  }, [user, isAdmin])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/users/${user.id}/registrations`)
      setRegistrations(response.data.data)
    } catch (err) {
      setError('Failed to load your registrations')
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminStats = async () => {
    try {
      // For now, use mock data to test the interface
      // TODO: Replace with actual API calls when backend is available
      setStats({
        totalEvents: 12,
        totalUsers: 156,
        totalRegistrations: 89,
        activeEvents: 5
      })
    } catch (err) {
      console.error('Failed to load admin stats:', err)
    }
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: null }
  ]

  if (loading) {
    return (
      <DashboardLayout currentPage="dashboard" breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center py-12">
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading your dashboard...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="dashboard" breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Welcome back, {user.name}!</h1>
            <p>Track your running events and manage your registrations</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <Icon name="runner" size={24} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900">{registrations.upcoming.length}</div>
              <div className="text-sm font-medium text-gray-600">Upcoming Events</div>
              <div className="text-xs text-primary-600 mt-1">Registered</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <Icon name="check-circle" size={24} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900">{registrations.past.length}</div>
              <div className="text-sm font-medium text-gray-600">Completed Events</div>
              <div className="text-xs text-green-600 mt-1">All time</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-warning">
              <Icon name="bar-chart" size={24} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900">{registrations.past.filter(r => r.has_logs > 0).length}</div>
              <div className="text-sm font-medium text-gray-600">Results Submitted</div>
              <div className="text-xs text-yellow-600 mt-1">With times</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-card">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming Events ({registrations.upcoming.length})
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'past'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Events ({registrations.past.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'upcoming' ? (
            <UpcomingEvents events={registrations.upcoming} />
          ) : (
            <PastEvents events={registrations.past} />
          )}
        </div>

        {/* Admin Section - Only visible to admin users */}
        {isAdmin && (
          <div className="border-t-2 border-gray-200 pt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                ⚙️ Administration
              </h2>
              <p className="text-gray-600">
                Administrative tools and system overview
              </p>
            </div>

            {/* Admin Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stat-card">
                <div className="stat-icon stat-icon-primary">
                  <Icon name="calendar" size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
                  <div className="text-sm font-medium text-gray-600">Total Events</div>
                  <div className="text-xs text-primary-600 mt-1">+{stats.activeEvents} active</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-success">
                  <Icon name="users" size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                  <div className="text-sm font-medium text-gray-600">Total Users</div>
                  <div className="text-xs text-green-600 mt-1">Registered runners</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-warning">
                  <Icon name="file-text" size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</div>
                  <div className="text-sm font-medium text-gray-600">Total Registrations</div>
                  <div className="text-xs text-yellow-600 mt-1">All time</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/dashboard/events/create"
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                    <Icon name="plus" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Create Event</h4>
                    <p className="text-sm text-gray-600">Add a new running event</p>
                  </div>
                </Link>

                <Link
                  to="/dashboard/users"
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <Icon name="users" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Manage Users</h4>
                    <p className="text-sm text-gray-600">View and edit user accounts</p>
                  </div>
                </Link>

                <Link
                  to="/dashboard/registrations"
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                    <Icon name="file-text" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">View Registrations</h4>
                    <p className="text-sm text-gray-600">Monitor event registrations</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

const UpcomingEvents = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming events</h3>
        <p className="text-gray-600 mb-6">
          You haven't registered for any upcoming events yet.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Events
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map(registration => (
        <div key={registration.id} className="card hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">
                <Link
                  to={`/events/${registration.event_id}`}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {registration.event_name}
                </Link>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="event-card-meta-item">
                  <span className="text-lg">📅</span>
                  <div>
                    <div className="font-medium text-gray-900">Date</div>
                    <div className="text-gray-600">{formatDateTime(registration.event_date)}</div>
                  </div>
                </div>

                <div className="event-card-meta-item">
                  <span className="text-lg">🏃‍♂️</span>
                  <div>
                    <div className="font-medium text-gray-900">Distance</div>
                    <div className="text-gray-600">{registration.distance}</div>
                  </div>
                </div>

                <div className="event-card-meta-item">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="font-medium text-gray-900">Type</div>
                    <div className="text-gray-600">
                      {registration.event_type === 'virtual' ? '💻 Virtual' : '📍 On-site'}
                    </div>
                  </div>
                </div>

                {registration.event_location && (
                  <div className="event-card-meta-item">
                    <span className="text-lg">📍</span>
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-gray-600">{registration.event_location}</div>
                    </div>
                  </div>
                )}

                <div className="event-card-meta-item">
                  <span className="text-lg">📝</span>
                  <div>
                    <div className="font-medium text-gray-900">Registered</div>
                    <div className="text-gray-600">{formatDate(registration.registered_at)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/events/${registration.event_id}`}
                className="btn btn-secondary"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const PastEvents = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No past events</h3>
        <p className="text-gray-600">
          You haven't participated in any events yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map(registration => (
        <PastEventCard key={registration.id} registration={registration} />
      ))}
    </div>
  )
}

const PastEventCard = ({ registration }) => {
  const [logs, setLogs] = useState([])
  const [showLogForm, setShowLogForm] = useState(false)
  const [logForm, setLogForm] = useState({
    finish_time: '',
    pace: '',
    distance_completed: registration.distance,
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (registration.has_logs > 0) {
      fetchLogs()
    }
  }, [registration.id])

  const fetchLogs = async () => {
    try {
      const response = await api.get(`/registrations/${registration.id}/logs`)
      setLogs(response.data.data.logs)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    }
  }

  const handleLogSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await api.post(`/registrations/${registration.id}/logs`, logForm)
      setShowLogForm(false)
      setLogForm({
        finish_time: '',
        pace: '',
        distance_completed: registration.distance,
        notes: ''
      })
      fetchLogs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit log')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>
          <Link
            to={`/events/${registration.event_id}`}
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            {registration.event_name}
          </Link>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>📅 Date:</strong> {formatDateTime(registration.event_date)}
          </div>

          <div>
            <strong>🏃‍♂️ Distance:</strong> {registration.distance}
          </div>

          <div>
            <strong>📍 Type:</strong> {registration.event_type === 'virtual' ? '💻 Virtual' : '📍 On-site'}
          </div>

          <div>
            <strong>✅ Status:</strong> {
              registration.status === 'completed' ? '🏁 Completed' :
              registration.status === 'registered' ? '📝 Registered' :
              '❌ Cancelled'
            }
          </div>
        </div>
      </div>

      {/* Results Section */}
      {logs.length > 0 ? (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Your Results 🏆</h4>
          {logs.map(log => (
            <div key={log.id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>⏱️ Finish Time:</strong> {formatTime(log.finish_time)}
                </div>
                {log.pace && (
                  <div>
                    <strong>🏃‍♂️ Pace:</strong> {log.pace} min/km
                  </div>
                )}
                <div>
                  <strong>📏 Distance:</strong> {log.distance_completed}
                </div>
              </div>
              {log.notes && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>📝 Notes:</strong> {log.notes}
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
                Submitted: {formatDate(log.submitted_at)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {!showLogForm ? (
            <button
              onClick={() => setShowLogForm(true)}
              className="btn"
            >
              📊 Submit Results
            </button>
          ) : (
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Submit Your Results</h4>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Finish Time (HH:MM:SS)</label>
                    <input
                      type="text"
                      placeholder="1:45:30"
                      value={logForm.finish_time}
                      onChange={(e) => setLogForm(prev => ({ ...prev, finish_time: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pace (MM:SS per km)</label>
                    <input
                      type="text"
                      placeholder="5:30"
                      value={logForm.pace}
                      onChange={(e) => setLogForm(prev => ({ ...prev, pace: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Distance Completed</label>
                  <input
                    type="text"
                    value={logForm.distance_completed}
                    onChange={(e) => setLogForm(prev => ({ ...prev, distance_completed: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes (optional)</label>
                  <textarea
                    placeholder="How did it go? Any thoughts about the race..."
                    value={logForm.notes}
                    onChange={(e) => setLogForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn"
                  >
                    {submitting ? 'Submitting...' : 'Submit Results'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserDashboard

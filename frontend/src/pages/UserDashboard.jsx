import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, formatDateTime, formatTime } from '../utils/dateUtils'

const UserDashboard = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('upcoming')

  useEffect(() => {
    fetchRegistrations()
  }, [user])

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

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Welcome back, {user.name}! 👋</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Track your running events and manage your registrations
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#007bff', margin: '0 0 0.5rem 0' }}>
            {registrations.upcoming.length}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Upcoming Events</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>
            {registrations.past.length}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Completed Events</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#6f42c1', margin: '0 0 0.5rem 0' }}>
            {registrations.past.filter(r => r.has_logs > 0).length}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Results Submitted</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e9ecef',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'upcoming' ? '2px solid #007bff' : 'none',
              color: activeTab === 'upcoming' ? '#007bff' : '#666',
              fontWeight: activeTab === 'upcoming' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Upcoming Events ({registrations.upcoming.length})
          </button>
          
          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'past' ? '2px solid #007bff' : 'none',
              color: activeTab === 'past' ? '#007bff' : '#666',
              fontWeight: activeTab === 'past' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
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
    </div>
  )
}

const UpcomingEvents = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No upcoming events</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          You haven't registered for any upcoming events yet.
        </p>
        <Link to="/" className="btn">
          Browse Events
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {events.map(registration => (
        <div key={registration.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
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
                
                {registration.event_location && (
                  <div>
                    <strong>📍 Location:</strong> {registration.event_location}
                  </div>
                )}
                
                <div>
                  <strong>📝 Registered:</strong> {formatDate(registration.registered_at)}
                </div>
              </div>
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
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No past events</h3>
        <p style={{ color: '#666' }}>
          You haven't participated in any events yet.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
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

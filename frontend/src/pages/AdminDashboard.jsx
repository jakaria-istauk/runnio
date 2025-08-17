import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, formatDateTime } from '../utils/dateUtils'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('events')
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // This would ideally be a single stats endpoint, but we'll simulate with existing endpoints
      const [eventsRes, registrationsRes] = await Promise.all([
        api.get('/events?limit=1'),
        api.get('/registrations?limit=1')
      ])
      
      setStats({
        totalEvents: eventsRes.data.data.pagination.total,
        totalRegistrations: registrationsRes.data.data.pagination.total,
        totalUsers: 0 // Would need a users endpoint
      })
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Admin Dashboard 👨‍💼</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Manage events, registrations, and oversee the running community
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#007bff', margin: '0 0 0.5rem 0' }}>
            {stats.totalEvents}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Total Events</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>
            {stats.totalRegistrations}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Total Registrations</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#6f42c1', margin: '0 0 0.5rem 0' }}>
            {stats.totalUsers}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Total Users</p>
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
            onClick={() => setActiveTab('events')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'events' ? '2px solid #007bff' : 'none',
              color: activeTab === 'events' ? '#007bff' : '#666',
              fontWeight: activeTab === 'events' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Events Management
          </button>
          
          <button
            onClick={() => setActiveTab('registrations')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'registrations' ? '2px solid #007bff' : 'none',
              color: activeTab === 'registrations' ? '#007bff' : '#666',
              fontWeight: activeTab === 'registrations' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Registrations
          </button>
          
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'create' ? '2px solid #007bff' : 'none',
              color: activeTab === 'create' ? '#007bff' : '#666',
              fontWeight: activeTab === 'create' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Create Event
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'events' && <EventsManagement />}
        {activeTab === 'registrations' && <RegistrationsManagement />}
        {activeTab === 'create' && <CreateEvent onEventCreated={() => setActiveTab('events')} />}
      </div>
    </div>
  )
}

const EventsManagement = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/events?limit=50')
      setEvents(response.data.data.events)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await api.delete(`/events/${eventId}`)
      setEvents(events.filter(e => e.id !== eventId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event')
    }
  }

  if (loading) {
    return <div className="loading">Loading events...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Events Management</h3>
        <span style={{ color: '#666' }}>{events.length} events total</span>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map(event => (
          <div key={event.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>
                  <Link 
                    to={`/events/${event.id}`}
                    style={{ color: '#007bff', textDecoration: 'none' }}
                  >
                    {event.name}
                  </Link>
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong>📅 Date:</strong> {formatDateTime(event.event_date)}
                  </div>
                  
                  <div>
                    <strong>📍 Type:</strong> {event.type === 'virtual' ? '💻 Virtual' : '📍 On-site'}
                  </div>
                  
                  <div>
                    <strong>🏃‍♂️ Distances:</strong> {event.distances.join(', ')}
                  </div>
                  
                  <div>
                    <strong>👥 Registrations:</strong> {event.registration_count || 0}
                  </div>
                  
                  <div>
                    <strong>👤 Created by:</strong> {event.created_by_name}
                  </div>
                </div>
              </div>
              
              <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="btn btn-danger"
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const RegistrationsManagement = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    event_id: '',
    status: '',
    search: ''
  })

  useEffect(() => {
    fetchRegistrations()
  }, [filters])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: 50,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })

      const response = await api.get(`/registrations?${params}`)
      setRegistrations(response.data.data.registrations)
    } catch (err) {
      setError('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading registrations...</div>
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Registrations Management</h3>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Search User</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {registrations.map(registration => (
          <div key={registration.id} className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>👤 User:</strong> {registration.user_name} ({registration.user_email})
              </div>

              <div>
                <strong>🏃‍♂️ Event:</strong> {registration.event_name}
              </div>

              <div>
                <strong>📏 Distance:</strong> {registration.distance}
              </div>

              <div>
                <strong>✅ Status:</strong> {
                  registration.status === 'completed' ? '🏁 Completed' :
                  registration.status === 'registered' ? '📝 Registered' :
                  '❌ Cancelled'
                }
              </div>

              <div>
                <strong>📅 Registered:</strong> {formatDate(registration.registered_at)}
              </div>

              <div>
                <strong>📊 Logs:</strong> {registration.logs_count} submitted
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CreateEvent = ({ onEventCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'onsite',
    location: '',
    distances: ['5km'],
    event_date: '',
    registration_deadline: '',
    submission_deadline: '',
    metadata: {
      entry_fee: '',
      max_participants: '',
      difficulty_level: 'beginner'
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        metadata: Object.fromEntries(
          Object.entries(formData.metadata).filter(([_, v]) => v)
        )
      }

      await api.post('/events', payload)
      setSuccess(true)
      setTimeout(() => {
        onEventCreated()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const addDistance = () => {
    setFormData(prev => ({
      ...prev,
      distances: [...prev.distances, '']
    }))
  }

  const updateDistance = (index, value) => {
    setFormData(prev => ({
      ...prev,
      distances: prev.distances.map((d, i) => i === index ? value : d)
    }))
  }

  const removeDistance = (index) => {
    setFormData(prev => ({
      ...prev,
      distances: prev.distances.filter((_, i) => i !== index)
    }))
  }

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>🎉 Event Created Successfully!</h3>
        <p style={{ color: '#666' }}>Redirecting to events management...</p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Create New Event</h3>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              required
            >
              <option value="onsite">On-site</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            rows="4"
          />
        </div>

        {formData.type === 'onsite' && (
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required={formData.type === 'onsite'}
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Event Date *</label>
            <input
              type="datetime-local"
              value={formData.event_date}
              onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Registration Deadline</label>
            <input
              type="date"
              value={formData.registration_deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
            />
          </div>

          {formData.type === 'virtual' && (
            <div className="form-group">
              <label>Submission Deadline</label>
              <input
                type="date"
                value={formData.submission_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, submission_deadline: e.target.value }))}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Available Distances *</label>
          {formData.distances.map((distance, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={distance}
                onChange={(e) => updateDistance(index, e.target.value)}
                placeholder="e.g., 5km, 10km, marathon"
                required
              />
              {formData.distances.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDistance(index)}
                  className="btn btn-danger"
                  style={{ padding: '5px 10px' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDistance}
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            Add Distance
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Entry Fee ($)</label>
            <input
              type="number"
              value={formData.metadata.entry_fee}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, entry_fee: e.target.value }
              }))}
            />
          </div>

          <div className="form-group">
            <label>Max Participants</label>
            <input
              type="text"
              placeholder="unlimited or number"
              value={formData.metadata.max_participants}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, max_participants: e.target.value }
              }))}
            />
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <select
              value={formData.metadata.difficulty_level}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, difficulty_level: e.target.value }
              }))}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}

export default AdminDashboard

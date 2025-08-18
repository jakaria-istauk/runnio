import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'

const EventManagement = () => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Event Management' }
  ]

  if (loading) {
    return (
      <DashboardLayout currentPage="events" breadcrumbs={breadcrumbs}>
        <div className="loading">Loading events...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="events" breadcrumbs={breadcrumbs}>
      <div className="page-header">
        <div className="header-content">
          <h1>Event Management</h1>
          <p>Manage running events and registrations</p>
        </div>
        <Link to="/dashboard/events/create" className="btn btn-primary">
          <span className="btn-icon">➕</span>
          Create Event
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
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
                <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                  {event.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '14px' }}>
                  <div>
                    <strong>📅 Date:</strong> {formatDate(event.event_date)}
                  </div>
                  <div>
                    <strong>📍 Location:</strong> {event.location}
                  </div>
                  <div>
                    <strong>🏃‍♂️ Type:</strong> {event.type}
                  </div>
                  <div>
                    <strong>📏 Distances:</strong> {event.distances?.join(', ') || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <Link
                  to={`/dashboard/events/${event.id}/edit`}
                  className="btn btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                  ✏️ Edit
                </Link>
                
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="btn"
                  style={{ 
                    padding: '5px 10px', 
                    fontSize: '12px',
                    backgroundColor: '#dc3545',
                    color: 'white'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default EventManagement

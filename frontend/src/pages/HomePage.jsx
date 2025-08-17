import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { formatDate, formatDateTime, isEventUpcoming, isRegistrationOpen } from '../utils/dateUtils'

const HomePage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    date_from: '',
    date_to: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchEvents()
  }, [filters, pagination.page])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })
      
      const response = await api.get(`/events?${params}`)
      setEvents(response.data.data.events)
      setPagination(prev => ({
        ...prev,
        ...response.data.data.pagination
      }))
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (loading && events.length === 0) {
    return <div className="loading">Loading events...</div>
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Running Events</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Discover and register for exciting running events in your area
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Filter Events</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Event Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="virtual">Virtual</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Events List */}
      <div style={{ marginBottom: '2rem' }}>
        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No events found</h3>
            <p style={{ color: '#666' }}>Try adjusting your filters to see more events.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <button
            className="btn btn-secondary"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>
          
          <span style={{ 
            padding: '10px 15px', 
            background: '#f8f9fa', 
            borderRadius: '5px' 
          }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            className="btn btn-secondary"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

const EventCard = ({ event }) => {
  const upcoming = isEventUpcoming(event.event_date)
  const registrationOpen = isRegistrationOpen(event.registration_deadline)

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>
              <Link
                to={`/events/${event.id}`}
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                {event.name}
              </Link>
            </h3>
            <span style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              background: event.type === 'virtual' ? '#e3f2fd' : '#f3e5f5',
              color: event.type === 'virtual' ? '#1976d2' : '#7b1fa2'
            }}>
              {event.type === 'virtual' ? '💻 Virtual' : '📍 On-site'}
            </span>
          </div>

          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {event.description.length > 150
              ? event.description.substring(0, 150) + '...'
              : event.description
            }
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>📅 Date:</strong> {formatDateTime(event.event_date)}
            </div>

            {event.location && (
              <div>
                <strong>📍 Location:</strong> {event.location}
              </div>
            )}

            <div>
              <strong>🏃‍♂️ Distances:</strong> {event.distances.join(', ')}
            </div>

            <div>
              <strong>📝 Registration:</strong> {
                registrationOpen
                  ? `Open until ${formatDate(event.registration_deadline)}`
                  : 'Closed'
              }
            </div>
          </div>
        </div>

        <div style={{ marginLeft: '1rem' }}>
          <Link
            to={`/events/${event.id}`}
            className="btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage

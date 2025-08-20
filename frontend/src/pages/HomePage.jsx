import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { formatDate, formatDateTime, isRegistrationOpen } from '../utils/dateUtils'
import Icon from '../components/Icon'

const HomePage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
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

  const getEventLocation = (event) => {
    if (event.type === 'virtual' || !event.location) {
      return 'Virtual'
    }
    return event.location
  }

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading events...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container pt-6 pb-8">
        {/* Minimal Filter Section */}
        <div className="card mb-6">
          <div className="flex items-center gap-3">
            {/* Search Input - Always Visible */}
            <div className="flex-1">
              <input
                type="text"
                className="form-input"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center gap-2"
              aria-label="Toggle filters"
            >
              <Icon name="filter" size={16} />
              Filters
            </button>
          </div>

          {/* Collapsible Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <select
                    className="form-input"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="virtual">Virtual</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div className="form-group lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">From Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={filters.date_from}
                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="form-label">To Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={filters.date_to}
                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-6">{error}</div>
        )}

        {/* Events List */}
        <div className="mb-8">
          {events.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-3 mb-8">
            <button
              className="btn btn-secondary"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>

            <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
              Page {pagination.page} of {pagination.pages}
            </div>

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
    </div>
  )
}

const EventCard = ({ event }) => {
  const registrationOpen = isRegistrationOpen(event.registration_deadline)
  const isRegistered = event.is_registered === 1

  // Default cover image if none provided
  const coverImage = event.cover_image || `https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=200&fit=crop&auto=format`

  return (
    <div className="event-card group">
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <img
          src={coverImage}
          alt={event.name}
          className="event-card-image group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400&h=200&fit=crop&auto=format`
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={`event-badge ${event.type === 'virtual' ? 'event-badge-virtual' : 'event-badge-onsite'}`}>
            <Icon name={event.type === 'virtual' ? 'external-link' : 'map-pin'} size={14} className="mr-1" />
            {event.type === 'virtual' ? 'Virtual' : 'On-site'}
          </span>

          {isRegistered && (
            <span className="event-badge event-badge-registered">
              <Icon name="check-circle" size={14} className="mr-1" />
              Registered
            </span>
          )}
        </div>

        {/* Registration Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`event-badge ${registrationOpen ? 'event-badge-open' : 'event-badge-closed'}`}>
            {registrationOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="event-card-content">
        <div className="mb-4">
          <Link
            to={`/events/${event.id}`}
            className="event-card-title hover:text-primary-600 transition-colors"
          >
            {event.name}
          </Link>
        </div>

        {/* Inline Event Metadata */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon name="calendar" size={16} className="text-gray-500" />
              <span>{formatDateTime(event.event_date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="map-pin" size={16} className="text-gray-500" />
              <span className="truncate">{getEventLocation(event)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon name="runner" size={16} className="text-primary-600" />
              <div className="flex flex-wrap gap-1">
                {event.distances.map((distance, index) => (
                  <span key={index} className="distance-badge">
                    {distance}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Icon name={registrationOpen ? "check-circle" : "x-circle"} size={16} className={registrationOpen ? "text-green-500" : "text-red-500"} />
              <span className="truncate">
                {registrationOpen
                  ? `Until ${formatDate(event.registration_deadline)}`
                  : 'Registration Closed'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/events/${event.id}`}
            className="btn btn-primary w-full justify-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage

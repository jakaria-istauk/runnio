import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'
import Icon from '../../components/Icon'
import eventPlaceholder from '../../images/event-placeholder.jpeg'

const EventManagement = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    type: 'all', // all, virtual, in-person
    status: 'all' // all, upcoming, past
  })
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [events, filters])

  const applyFilters = () => {
    let filtered = [...events]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'virtual') {
        filtered = filtered.filter(event =>
          event.location?.toLowerCase().includes('virtual') ||
          event.location?.toLowerCase().includes('online') ||
          !event.location
        )
      } else if (filters.type === 'in-person') {
        filtered = filtered.filter(event =>
          event.location &&
          !event.location.toLowerCase().includes('virtual') &&
          !event.location.toLowerCase().includes('online')
        )
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      const now = new Date()
      if (filters.status === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.event_date) > now)
      } else if (filters.status === 'past') {
        filtered = filtered.filter(event => new Date(event.event_date) <= now)
      }
    }

    setFilteredEvents(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/events?limit=50')
      const eventsData = response.data.data.events
      setEvents(eventsData)
      setFilteredEvents(eventsData)
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

  const getEventLocation = (event) => {
    if (!event.location ||
        event.location.toLowerCase().includes('virtual') ||
        event.location.toLowerCase().includes('online')) {
      return 'Virtual'
    }
    return event.location
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
          <Icon name="plus" size={16} />
          Create Event
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon name="filter" size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            <span className="text-xs text-gray-500">
              ({filteredEvents.length} of {events.length} events)
            </span>
          </div>
          <Icon
            name={filtersExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            className="text-gray-400"
          />
        </button>

        {filtersExpanded && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Search Events</label>
                <div className="relative">
                  <Icon name="search" size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Event Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="virtual">Virtual</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid - 3-4 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="card group hover:shadow-lg transition-all duration-200">
            {/* Event Cover Image */}
            <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
              <img
                src={eventPlaceholder}
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Event Content */}
            <div className="space-y-4">
              {/* Event Title and Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {event.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {event.description}
                </p>
              </div>

              {/* Event Metadata */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="calendar" size={16} className="text-gray-400" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="map-pin" size={16} className="text-gray-400" />
                  <span className="truncate">{getEventLocation(event)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="activity" size={16} className="text-gray-400" />
                  <span>{event.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon name="target" size={16} className="text-gray-400" />
                  <span className="truncate">{event.distances?.join(', ') || 'N/A'}</span>
                </div>
              </div>

              {/* Event Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  new Date(event.event_date) > new Date()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Past'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  to={`/events/${event.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Icon name="eye" size={14} />
                  View Details
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/dashboard/events/${event.id}/edit`}
                    className="btn btn-secondary text-xs px-3 py-1.5"
                  >
                    <Icon name="edit" size={14} />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="btn text-xs px-3 py-1.5 bg-red-600 text-white hover:bg-red-700"
                  >
                    <Icon name="trash" size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Icon name="calendar" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {events.length === 0 ? 'No events found' : 'No events match your filters'}
          </h3>
          <p className="text-gray-600 mb-6">
            {events.length === 0
              ? 'Get started by creating your first running event.'
              : 'Try adjusting your search criteria or filters.'
            }
          </p>
          {events.length === 0 && (
            <Link to="/dashboard/events/create" className="btn btn-primary">
              <Icon name="plus" size={16} />
              Create Event
            </Link>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default EventManagement

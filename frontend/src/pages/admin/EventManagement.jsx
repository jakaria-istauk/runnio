import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'
import Icon from '../../components/Icon'

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
          <Icon name="plus" size={16} />
          Create Event
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="card group hover:shadow-lg transition-all duration-200">
            {/* Event Cover Image Placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
              <Icon name="runner" size={48} className="text-primary-600" />
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
                  <span className="truncate">{event.location}</span>
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
      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <Icon name="calendar" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first running event.</p>
          <Link to="/dashboard/events/create" className="btn btn-primary">
            <Icon name="plus" size={16} />
            Create Event
          </Link>
        </div>
      )}
    </DashboardLayout>
  )
}

export default EventManagement

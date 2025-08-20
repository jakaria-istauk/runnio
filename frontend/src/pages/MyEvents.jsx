import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import Icon from '../components/Icon'
import { formatDate, formatDateTime, isEventUpcoming } from '../utils/dateUtils'

const MyEvents = () => {
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

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'My Events', link: null }
  ]

  if (loading) {
    return (
      <DashboardLayout currentPage="my-events" breadcrumbs={breadcrumbs}>
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading your events...
        </div>
      </DashboardLayout>
    )
  }

  const EventCard = ({ registration, isPast = false }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Event Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <Link
                  to={`/events/${registration.event_id}`}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {registration.event_name}
                </Link>
              </h3>
              <div className="flex flex-col gap-2 ml-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  isPast
                    ? 'bg-green-100 text-green-800'
                    : 'bg-primary-100 text-primary-800'
                }`}>
                  {isPast ? 'Completed' : 'Upcoming'}
                </span>
                {isPast && registration.has_logs > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Results Submitted
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Icon name="map-pin" size={16} className="text-gray-400" />
                <span>{registration.event_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="calendar" size={16} className="text-gray-400" />
                <span>{formatDate(registration.event_date)} at {formatDateTime(registration.event_date).split(' ')[1]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="runner" size={16} className="text-gray-400" />
                <span>Distance: {registration.distance}</span>
              </div>
              {registration.registration_date && (
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} className="text-gray-400" />
                  <span>Registered: {formatDate(registration.registration_date)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[140px]">
            <Link
              to={`/events/${registration.event_id}`}
              className="btn btn-primary text-center"
            >
              <Icon name="eye" size={16} />
              View Details
            </Link>
            {!isPast && (
              <button className="btn btn-secondary text-center">
                <Icon name="calendar" size={16} />
                Add to Calendar
              </button>
            )}
            {isPast && registration.has_logs === 0 && (
              <button className="btn btn-secondary text-center">
                <Icon name="upload" size={16} />
                Submit Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout currentPage="my-events" breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-lg text-gray-600">
              Manage your running event registrations and track your progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="btn btn-secondary">
              <Icon name="search" size={16} />
              Browse Events
            </Link>
            <button className="btn btn-primary">
              <Icon name="download" size={16} />
              Export History
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="runner" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{registrations.upcoming.length}</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="check-circle" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{registrations.past.length}</div>
            <div className="text-sm text-gray-600">Completed Events</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="bar-chart" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{registrations.past.filter(r => r.has_logs > 0).length}</div>
            <div className="text-sm text-gray-600">Results Submitted</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="calendar" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{registrations.upcoming.length + registrations.past.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
        </div>

        {/* Event Management Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="calendar" size={16} />
                  Upcoming Events
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {registrations.upcoming.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'past'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} />
                  Past Events
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {registrations.past.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'upcoming' && (
              <div>
                {registrations.upcoming.length === 0 ? (
                  <div className="empty-state">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="calendar" size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-600 mb-6">You haven't registered for any upcoming events yet.</p>
                    <Link to="/" className="btn btn-primary">
                      <Icon name="search" size={16} />
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Your Upcoming Events ({registrations.upcoming.length})
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="info" size={16} />
                        <span>Click on event names to view details</span>
                      </div>
                    </div>
                    {registrations.upcoming.map(registration => (
                      <EventCard key={registration.id} registration={registration} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div>
                {registrations.past.length === 0 ? (
                  <div className="empty-state">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="check-circle" size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No past events</h3>
                    <p className="text-gray-600 mb-6">You haven't completed any events yet.</p>
                    <Link to="/" className="btn btn-primary">
                      <Icon name="search" size={16} />
                      Find Your First Event
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Your Completed Events ({registrations.past.length})
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="info" size={16} />
                        <span>Submit your results to track your progress</span>
                      </div>
                    </div>
                    {registrations.past.map(registration => (
                      <EventCard key={registration.id} registration={registration} isPast={true} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyEvents

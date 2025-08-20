import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { formatDate, formatDateTime, isEventUpcoming, isRegistrationOpen } from '../utils/dateUtils'

const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registering, setRegistering] = useState(false)
  const [selectedDistance, setSelectedDistance] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/events/${id}`)
      setEvent(response.data.data)
      if (response.data.data.distances.length > 0) {
        setSelectedDistance(response.data.data.distances[0])
      }
    } catch (err) {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!selectedDistance) {
      setError('Please select a distance')
      return
    }

    try {
      setRegistering(true)
      setError('')

      await api.post(`/events/${id}/register`, {
        distance: selectedDistance
      })

      setRegistrationSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const getEventLocation = (event) => {
    if (event.type === 'virtual' || !event.location) {
      return 'Virtual'
    }
    return event.location
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading event details...
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="alert alert-error">Event not found</div>
        </div>
      </div>
    )
  }

  const upcoming = isEventUpcoming(event.event_date)
  const registrationOpen = isRegistrationOpen(event.registration_deadline)
  const canRegister = upcoming && registrationOpen && !registrationSuccess

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary mb-6 inline-flex items-center gap-2"
          >
            <span>←</span>
            Back to Events
          </button>

          {/* Event Cover Image */}
          {event.cover_image && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={event.cover_image}
                alt={event.name}
                className="w-full h-64 sm:h-80 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 m-0">{event.name}</h1>
            <span className={`event-badge ${event.type === 'virtual' ? 'event-badge-virtual' : 'event-badge-onsite'} text-sm`}>
              <Icon name={event.type === 'virtual' ? 'external-link' : 'map-pin'} size={14} className="mr-1" />
              {event.type === 'virtual' ? 'Virtual Event' : 'On-site Event'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="event-card-meta-item">
                  <Icon name="calendar" size={20} className="text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">Date & Time</div>
                    <div className="text-gray-600">{formatDateTime(event.event_date)}</div>
                  </div>
                </div>

                <div className="event-card-meta-item">
                  <Icon name="map-pin" size={20} className="text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600">{getEventLocation(event)}</div>
                  </div>
                </div>

                <div className="event-card-meta-item">
                  <Icon name="runner" size={20} className="text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">Available Distances</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.distances.map((distance, index) => (
                        <span key={index} className="distance-badge distance-badge-primary">
                          {distance}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="event-card-meta-item">
                  <Icon name="clock" size={20} className="text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">Registration Deadline</div>
                    <div className="text-gray-600">
                      {event.registration_deadline
                        ? formatDate(event.registration_deadline)
                        : 'No deadline specified'
                      }
                    </div>
                  </div>
                </div>

                {event.submission_deadline && (
                  <div className="event-card-meta-item">
                    <Icon name="upload" size={20} className="text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-900">Results Submission</div>
                      <div className="text-gray-600">{formatDate(event.submission_deadline)}</div>
                    </div>
                  </div>
                )}

                <div className="event-card-meta-item">
                  <Icon name="users" size={20} className="text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">Registrations</div>
                    <div className="text-gray-600">
                      {event.registration_count || 0}
                      {event.metadata?.max_participants && event.metadata.max_participants !== 'unlimited' && (
                        <span> / {event.metadata.max_participants}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="event-card-meta-item">
                  <Icon name="user" size={20} className="text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">Created by</div>
                    <div className="text-gray-600">{event.created_by_name}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Metadata */}
            {Object.keys(event.metadata || {}).length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.metadata.entry_fee && (
                    <div className="event-card-meta-item">
                      <Icon name="dollar-sign" size={20} className="text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Entry Fee</div>
                        <div className="text-gray-600">${event.metadata.entry_fee}</div>
                      </div>
                    </div>
                  )}

                  {event.metadata.difficulty_level && (
                    <div className="event-card-meta-item">
                      <Icon name="trending-up" size={20} className="text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Difficulty</div>
                        <div className="text-gray-600">{event.metadata.difficulty_level}</div>
                      </div>
                    </div>
                  )}

                  {event.metadata.max_participants && (
                    <div className="event-card-meta-item">
                      <Icon name="users" size={20} className="text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Max Participants</div>
                        <div className="text-gray-600">
                          {event.metadata.max_participants === 'unlimited'
                            ? 'Unlimited'
                            : event.metadata.max_participants
                          }
                        </div>
                      </div>
                    </div>
                  )}

                  {event.metadata.registration_link && (
                    <div className="event-card-meta-item">
                      <Icon name="external-link" size={20} className="text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">External Registration</div>
                        <a
                          href={event.metadata.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 underline"
                        >
                          Register Here
                        </a>
                      </div>
                    </div>
                  )}

                  {event.metadata.social_event_link && (
                    <div className="event-card-meta-item">
                      <Icon name="external-link" size={20} className="text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Event Page</div>
                        <a
                          href={event.metadata.social_event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 underline"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Distance-Based Pricing */}
            {event.metadata?.pricing && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h3>
                <div className="space-y-3">
                  {JSON.parse(event.metadata.pricing).map((pricing, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{pricing.distance}</span>
                      <span className="text-lg font-semibold text-primary-600">${pricing.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Registration</h3>

              {registrationSuccess ? (
                <div className="alert alert-success">
                  🎉 Successfully registered for this event!
                </div>
              ) : (
                <>
                  {error && (
                    <div className="alert alert-error mb-4">
                      {error}
                    </div>
                  )}

                  {!upcoming ? (
                    <div className="alert alert-error">
                      This event has already occurred.
                    </div>
                  ) : !registrationOpen ? (
                    <div className="alert alert-error">
                      Registration deadline has passed.
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Please log in to register for this event.
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary w-full justify-center"
                      >
                        Login to Register
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">Select Distance</label>
                        <select
                          className="form-input"
                          value={selectedDistance}
                          onChange={(e) => setSelectedDistance(e.target.value)}
                        >
                          {event.distances.map(distance => (
                            <option key={distance} value={distance}>
                              {distance}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleRegister}
                        disabled={registering || !selectedDistance}
                        className="btn btn-primary w-full justify-center"
                      >
                        {registering ? (
                          <div className="flex items-center gap-2">
                            <div className="loading-spinner w-4 h-4"></div>
                            Registering...
                          </div>
                        ) : (
                          'Register for Event'
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage

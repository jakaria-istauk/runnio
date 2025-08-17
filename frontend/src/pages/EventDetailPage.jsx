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

  if (loading) {
    return <div className="loading">Loading event details...</div>
  }

  if (error && !event) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container">
        <div className="alert alert-error">Event not found</div>
      </div>
    )
  }

  const upcoming = isEventUpcoming(event.event_date)
  const registrationOpen = isRegistrationOpen(event.registration_deadline)
  const canRegister = upcoming && registrationOpen && !registrationSuccess

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          ← Back to Events
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>{event.name}</h1>
          <span style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 'bold',
            background: event.type === 'virtual' ? '#e3f2fd' : '#f3e5f5',
            color: event.type === 'virtual' ? '#1976d2' : '#7b1fa2'
          }}>
            {event.type === 'virtual' ? '💻 Virtual Event' : '📍 On-site Event'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          <div className="card">
            <h3>Event Description</h3>
            <p style={{ lineHeight: '1.6', color: '#555' }}>{event.description}</p>
          </div>

          <div className="card">
            <h3>Event Details</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>📅 Date & Time:</strong> {formatDateTime(event.event_date)}
              </div>
              
              {event.location && (
                <div>
                  <strong>📍 Location:</strong> {event.location}
                </div>
              )}
              
              <div>
                <strong>🏃‍♂️ Available Distances:</strong> {event.distances.join(', ')}
              </div>
              
              <div>
                <strong>📝 Registration Deadline:</strong> {
                  event.registration_deadline 
                    ? formatDate(event.registration_deadline)
                    : 'No deadline specified'
                }
              </div>
              
              {event.submission_deadline && (
                <div>
                  <strong>📤 Results Submission Deadline:</strong> {formatDate(event.submission_deadline)}
                </div>
              )}
              
              <div>
                <strong>👥 Current Registrations:</strong> {event.registration_count || 0}
                {event.metadata?.max_participants && event.metadata.max_participants !== 'unlimited' && (
                  <span> / {event.metadata.max_participants}</span>
                )}
              </div>
              
              <div>
                <strong>👤 Created by:</strong> {event.created_by_name}
              </div>
            </div>
          </div>

          {/* Event Metadata */}
          {Object.keys(event.metadata || {}).length > 0 && (
            <div className="card">
              <h3>Additional Information</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {event.metadata.entry_fee && (
                  <div>
                    <strong>💰 Entry Fee:</strong> ${event.metadata.entry_fee}
                  </div>
                )}
                
                {event.metadata.difficulty_level && (
                  <div>
                    <strong>⭐ Difficulty:</strong> {event.metadata.difficulty_level}
                  </div>
                )}
                
                {event.metadata.max_participants && (
                  <div>
                    <strong>👥 Max Participants:</strong> {
                      event.metadata.max_participants === 'unlimited' 
                        ? 'Unlimited' 
                        : event.metadata.max_participants
                    }
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Registration Sidebar */}
        <div>
          <div className="card">
            <h3>Registration</h3>
            
            {registrationSuccess ? (
              <div className="alert alert-success">
                🎉 Successfully registered for this event!
              </div>
            ) : (
              <>
                {error && (
                  <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
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
                  <div>
                    <p style={{ marginBottom: '1rem' }}>
                      Please log in to register for this event.
                    </p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="btn"
                      style={{ width: '100%' }}
                    >
                      Login to Register
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="form-group">
                      <label>Select Distance</label>
                      <select
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
                      className="btn"
                      style={{ width: '100%' }}
                    >
                      {registering ? 'Registering...' : 'Register for Event'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage

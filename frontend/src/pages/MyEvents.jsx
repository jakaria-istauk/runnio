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
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>
            <Link 
              to={`/events/${registration.event_id}`}
              style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
            >
              {registration.event_name}
            </Link>
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="map-pin" size={16} /> {registration.event_location}
          </p>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="calendar" size={16} /> {formatDate(registration.event_date)} at {formatDateTime(registration.event_date).split(' ')[1]}
          </p>
          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="runner" size={16} /> Distance: {registration.distance}
          </p>
          {registration.registration_date && (
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Registered: {formatDate(registration.registration_date)}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: isPast ? 'var(--success-color)' : 'var(--primary-color)',
            color: 'white'
          }}>
            {isPast ? 'Completed' : 'Upcoming'}
          </span>
          
          {isPast && registration.has_logs > 0 && (
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500',
              backgroundColor: 'var(--warning-color)',
              color: 'white'
            }}>
              Results Submitted
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout currentPage="my-events" breadcrumbs={breadcrumbs}>
      <div className="dashboard-overview">
        <div className="dashboard-header">
          <h1>My Events</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            View and manage your event registrations
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <Icon name="runner" size={28} className="stat-icon" />
            <div className="stat-content">
              <h3>{registrations.upcoming.length}</h3>
              <p>Upcoming Events</p>
              <span className="stat-change">Registered</span>
            </div>
          </div>

          <div className="stat-card success">
            <Icon name="check-circle" size={28} className="stat-icon" />
            <div className="stat-content">
              <h3>{registrations.past.length}</h3>
              <p>Completed Events</p>
              <span className="stat-change">All time</span>
            </div>
          </div>

          <div className="stat-card warning">
            <Icon name="bar-chart" size={28} className="stat-icon" />
            <div className="stat-content">
              <h3>{registrations.past.filter(r => r.has_logs > 0).length}</h3>
              <p>Results Submitted</p>
              <span className="stat-change">With times</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '2px solid var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary-color)' : 'none',
                color: activeTab === 'upcoming' ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'upcoming' ? '600' : 'normal',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Upcoming Events ({registrations.upcoming.length})
            </button>
            
            <button
              onClick={() => setActiveTab('past')}
              className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'past' ? '2px solid var(--primary-color)' : 'none',
                color: activeTab === 'past' ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'past' ? '600' : 'normal',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Past Events ({registrations.past.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'upcoming' && (
              <div>
                {registrations.upcoming.length === 0 ? (
                  <div className="empty-state" style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <h3>No upcoming events</h3>
                    <p>You haven't registered for any upcoming events yet.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
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
                  <div className="empty-state" style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <h3>No past events</h3>
                    <p>You haven't completed any events yet.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                      Find Your First Event
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
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

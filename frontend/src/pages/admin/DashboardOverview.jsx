import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'
import { Users, FileText, Plus, User } from '../../components/icons'


const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    activeEvents: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // For now, use mock data to test the interface
      // TODO: Replace with actual API calls when backend is available
      setStats({
        totalEvents: 12,
        totalUsers: 156,
        totalRegistrations: 89,
        activeEvents: 5
      })

      setRecentActivity([
        {
          id: 1,
          user_name: 'John Doe',
          event_name: 'City Marathon 2024',
          distance: '42km',
          registered_at: new Date().toISOString()
        },
        {
          id: 2,
          user_name: 'Jane Smith',
          event_name: 'Park Run',
          distance: '5km',
          registered_at: new Date(Date.now() - 86400000).toISOString()
        }
      ])

      // Uncomment when backend is available:
      /*
      const [eventsRes, usersRes, registrationsRes] = await Promise.all([
        api.get('/events?limit=1'),
        api.get('/users?limit=1'),
        api.get('/registrations?limit=1')
      ])

      const recentRes = await api.get('/registrations?limit=5')

      setStats({
        totalEvents: eventsRes.data.data.pagination.total,
        totalUsers: usersRes.data.data.pagination.total,
        totalRegistrations: registrationsRes.data.data.pagination.total,
        activeEvents: eventsRes.data.data.events?.filter(e => new Date(e.event_date) > new Date()).length || 0
      })

      setRecentActivity(recentRes.data.data.registrations || [])
      */
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="dashboard" breadcrumbs={breadcrumbs}>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="dashboard" breadcrumbs={breadcrumbs}>
      <div className="dashboard-overview">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome to your admin dashboard. Here's what's happening with your running events platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">🏃‍♂️</div>
            <div className="stat-content">
              <h3>{stats.totalEvents}</h3>
              <p>Total Events</p>
              <span className="stat-change">+{stats.activeEvents} active</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
              <span className="stat-change">Registered runners</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <FileText className="w-8 h-8" />
            </div>
            <div className="stat-content">
              <h3>{stats.totalRegistrations}</h3>
              <p>Total Registrations</p>
              <span className="stat-change">All time</span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.totalRegistrations > 0 ? Math.round(stats.totalRegistrations / stats.totalEvents) : 0}</h3>
              <p>Avg. per Event</p>
              <span className="stat-change">Registration rate</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/dashboard/events/create" className="action-card">
              <div className="action-icon">
                <Plus className="w-6 h-6" />
              </div>
              <div className="action-content">
                <h3>Create Event</h3>
                <p>Add a new running event</p>
              </div>
            </Link>

            <Link to="/dashboard/users" className="action-card">
              <div className="action-icon">
                <User className="w-6 h-6" />
              </div>
              <div className="action-content">
                <h3>Manage Users</h3>
                <p>View and edit user accounts</p>
              </div>
            </Link>

            <Link to="/dashboard/registrations" className="action-card">
              <div className="action-icon">
                <FileText className="w-6 h-6" />
              </div>
              <div className="action-content">
                <h3>View Registrations</h3>
                <p>Monitor event registrations</p>
              </div>
            </Link>

            <Link to="/admin/settings" className="action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-content">
                <h3>System Settings</h3>
                <p>Configure platform settings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/admin/registrations" className="view-all-link">View All →</Link>
          </div>
          
          <div className="activity-feed">
            {recentActivity.length > 0 ? (
              recentActivity.map((registration, index) => (
                <div key={registration.id || index} className="activity-item">
                  <div className="activity-icon">🏃‍♂️</div>
                  <div className="activity-content">
                    <p>
                      <strong>{registration.user_name}</strong> registered for{' '}
                      <strong>{registration.event_name}</strong>
                    </p>
                    <span className="activity-time">
                      {formatDate(registration.registered_at)}
                    </span>
                  </div>
                  <div className="activity-badge">
                    {registration.distance}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-section">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-indicator success"></div>
              <span>Database Connection</span>
              <span className="status-value">Healthy</span>
            </div>
            <div className="status-item">
              <div className="status-indicator success"></div>
              <span>API Services</span>
              <span className="status-value">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator success"></div>
              <span>User Authentication</span>
              <span className="status-value">Active</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardOverview

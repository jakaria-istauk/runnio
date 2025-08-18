import { useState, useEffect } from 'react'
import api from '../../utils/api'
import AdminLayout from '../../components/admin/AdminLayout'

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    event_id: '',
    status: '',
    search: ''
  })

  useEffect(() => {
    fetchRegistrations()
  }, [filters])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: 50,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })

      const response = await api.get(`/registrations?${params}`)
      setRegistrations(response.data.data.registrations)
    } catch (err) {
      setError('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/admin' },
    { label: 'Registration Management' }
  ]

  if (loading) {
    return (
      <AdminLayout currentPage="registrations" breadcrumbs={breadcrumbs}>
        <div className="loading">Loading registrations...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="registrations" breadcrumbs={breadcrumbs}>
      <div className="page-header">
        <div className="header-content">
          <h1>Registration Management</h1>
          <p>Monitor and manage event registrations</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Search User</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Filter by Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Filter by Event</label>
            <input
              type="text"
              placeholder="Event ID..."
              value={filters.event_id}
              onChange={(e) => setFilters(prev => ({ ...prev, event_id: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {registrations.map(registration => (
          <div key={registration.id} className="card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong>👤 User:</strong> {registration.user_name} ({registration.user_email})
              </div>

              <div>
                <strong>🏃‍♂️ Event:</strong> {registration.event_name}
              </div>

              <div>
                <strong>📏 Distance:</strong> {registration.distance}
              </div>

              <div>
                <strong>✅ Status:</strong> {
                  registration.status === 'completed' ? '🏁 Completed' :
                  registration.status === 'registered' ? '📝 Registered' :
                  '❌ Cancelled'
                }
              </div>

              <div>
                <strong>📅 Registered:</strong> {formatDate(registration.registered_at)}
              </div>

              <div>
                <strong>📊 Logs:</strong> {registration.logs_count} submitted
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default RegistrationManagement

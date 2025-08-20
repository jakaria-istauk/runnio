import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'
import Icon from '../../components/Icon'

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
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Registration Management' }
  ]

  if (loading) {
    return (
      <DashboardLayout currentPage="registrations" breadcrumbs={breadcrumbs}>
        <div className="loading">Loading registrations...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="registrations" breadcrumbs={breadcrumbs}>
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
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="filter" size={20} className="text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
            <div className="relative">
              <Icon name="search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Event</label>
            <input
              type="text"
              placeholder="Event ID..."
              value={filters.event_id}
              onChange={(e) => setFilters(prev => ({ ...prev, event_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Registrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {registrations.map(registration => (
          <div key={registration.id} className="card hover:shadow-lg transition-all duration-200">
            {/* Registration Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="user" size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{registration.user_name}</h3>
                  <p className="text-sm text-gray-600">{registration.user_email}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                registration.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : registration.status === 'registered'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <Icon
                  name={
                    registration.status === 'completed' ? 'check-circle' :
                    registration.status === 'registered' ? 'clock' : 'x-circle'
                  }
                  size={12}
                  className="mr-1"
                />
                {registration.status === 'completed' ? 'Completed' :
                 registration.status === 'registered' ? 'Registered' : 'Cancelled'}
              </span>
            </div>

            {/* Registration Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="runner" size={16} className="text-gray-400" />
                <span className="font-medium">Event:</span>
                <span>{registration.event_name}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="target" size={16} className="text-gray-400" />
                <span className="font-medium">Distance:</span>
                <span>{registration.distance}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="calendar" size={16} className="text-gray-400" />
                <span className="font-medium">Registered:</span>
                <span>{formatDate(registration.registered_at)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="activity" size={16} className="text-gray-400" />
                <span className="font-medium">Logs:</span>
                <span>{registration.logs_count} submitted</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors">
                <Icon name="eye" size={14} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {registrations.length === 0 && !loading && (
        <div className="text-center py-12">
          <Icon name="file-text" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
          <p className="text-gray-600">No registrations match your current filters.</p>
        </div>
      )}
    </DashboardLayout>
  )
}

export default RegistrationManagement

import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'
import UserTable from '../../components/admin/UserTable'
import UserModal from '../../components/admin/UserModal'
import Icon from '../../components/Icon'


const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create', 'edit', 'view'
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total: 0,
    per_page: 20
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Mock data for testing - replace with actual API call when backend is available
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          registrations_count: 5,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:45:00Z'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          registrations_count: 3,
          created_at: '2024-02-01T09:15:00Z',
          updated_at: '2024-02-01T09:15:00Z'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'user',
          registrations_count: 8,
          created_at: '2024-01-10T16:20:00Z',
          updated_at: '2024-01-25T11:30:00Z'
        }
      ]

      setUsers(mockUsers)
      setPagination({
        current_page: 1,
        total_pages: 1,
        total: mockUsers.length,
        per_page: 20
      })

      // Uncomment when backend is available:
      /*
      const params = new URLSearchParams({
        ...filters,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })

      const response = await api.get(`/users?${params}`)
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
      */
    } catch (err) {
      setError('Failed to load users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalMode('view')
    setShowModal(true)
  }

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId)
    if (!confirm(`Are you sure you want to delete user "${user.name}"? This will also delete all their registrations and logs.`)) {
      return
    }

    try {
      await api.delete(`/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
      
      // Show success message
      alert('User deleted successfully')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleUserSaved = (savedUser) => {
    if (modalMode === 'create') {
      // Refresh the list to get the new user
      fetchUsers()
    } else {
      // Update the existing user in the list
      setUsers(users.map(u => u.id === savedUser.id ? savedUser : u))
    }
    setShowModal(false)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'User Management' }
  ]

  return (
    <DashboardLayout currentPage="users" breadcrumbs={breadcrumbs}>
      <div className="user-management">
        <div className="page-header">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage user accounts, roles, and permissions</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreateUser}
          >
            <Icon name="plus" size={16} />
            Add New User
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button
              className="alert-close"
              onClick={() => setError('')}
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* Filters Section - Compact */}
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="filter" size={16} className="text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label htmlFor="search" className="block text-xs font-medium text-gray-600 mb-1">
                  Search Users
                </label>
                <div className="relative">
                  <Icon name="search" size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-xs font-medium text-gray-600 mb-1">
                  Filter by Role
                </label>
                <select
                  id="role"
                  value={filters.role}
                  onChange={(e) => handleFilterChange({ role: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div>
                <label htmlFor="limit" className="block text-xs font-medium text-gray-600 mb-1">
                  Per Page
                </label>
                <select
                  id="limit"
                  value={filters.limit}
                  onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-600">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span>
                    Showing {users.length} of {pagination.total} users
                    {filters.search && ` matching "${filters.search}"`}
                    {filters.role && ` with role "${filters.role}"`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <UserTable
            users={users}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {showModal && (
          <UserModal
            user={selectedUser}
            mode={modalMode}
            onSave={handleUserSaved}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default UserManagement

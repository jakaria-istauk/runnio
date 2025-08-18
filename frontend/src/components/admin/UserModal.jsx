import { useState, useEffect } from 'react'
import api from '../../utils/api'

const UserModal = ({ user, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '' // Never pre-fill password
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        password: ''
      })
    }
    setErrors({})
  }, [user, mode])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required for new users'
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      let response
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role
      }

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password
      }

      if (mode === 'create') {
        response = await api.post('/users', submitData)
      } else {
        response = await api.put(`/users/${user.id}`, submitData)
      }

      onSave(response.data.data.user)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save user'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Add New User'
      case 'edit': return 'Edit User'
      case 'view': return 'User Details'
      default: return 'User'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-large max-w-md w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
          <button
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {mode === 'view' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? '👨‍💼' : '👤'}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registrations</label>
                <p className="text-gray-900">{user.registrations_count} events</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined</label>
                <p className="text-gray-900">{formatDate(user.created_at)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(user.updated_at)}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="alert alert-error">
                  {errors.submit}
                </div>
              )}

              <div>
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Enter user's full name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div>
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="role" className="form-label">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`form-input ${errors.role ? 'form-input-error' : ''}`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <div className="form-error">{errors.role}</div>}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                  placeholder={mode === 'create' ? 'Enter password' : 'Enter new password or leave blank'}
                />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          {mode === 'view' ? (
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                form="user-form"
                className="btn btn-primary"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="loading-spinner w-4 h-4"></div>
                    Saving...
                  </div>
                ) : (
                  mode === 'create' ? 'Create User' : 'Update User'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserModal

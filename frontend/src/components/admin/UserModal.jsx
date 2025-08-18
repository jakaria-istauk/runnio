import { useState, useEffect } from 'react'
import api from '../../utils/api'
import './UserModal.css'

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {mode === 'view' ? (
            <div className="user-details-view">
              <div className="detail-group">
                <label>Name</label>
                <p>{user.name}</p>
              </div>
              
              <div className="detail-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              
              <div className="detail-group">
                <label>Role</label>
                <p className={`role-badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {user.role === 'admin' ? '👨‍💼' : '👤'} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Registrations</label>
                <p>{user.registrations_count} events</p>
              </div>
              
              <div className="detail-group">
                <label>Joined</label>
                <p>{formatDate(user.created_at)}</p>
              </div>
              
              <div className="detail-group">
                <label>Last Updated</label>
                <p>{formatDate(user.updated_at)}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="user-form">
              {errors.submit && (
                <div className="form-error">
                  {errors.submit}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter user's full name"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={errors.role ? 'error' : ''}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <span className="field-error">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder={mode === 'create' ? 'Enter password' : 'Enter new password or leave blank'}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-actions">
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
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (mode === 'create' ? 'Create User' : 'Update User')}
                </button>
              </div>
            </form>
          )}
        </div>

        {mode === 'view' && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserModal

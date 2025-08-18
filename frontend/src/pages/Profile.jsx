import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    dietary_restrictions: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        emergency_contact_name: user.emergency_contact_name || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
        medical_conditions: user.medical_conditions || '',
        dietary_restrictions: user.dietary_restrictions || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put(`/users/${user.id}`, formData)
      updateUser(response.data.data)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)
    setError('')
    setSuccess('')

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match')
      setPasswordLoading(false)
      return
    }

    try {
      await api.put(`/users/${user.id}/password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      setSuccess('Password updated successfully!')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Profile', link: null }
  ]

  return (
    <DashboardLayout currentPage="profile" breadcrumbs={breadcrumbs}>
      <div className="dashboard-overview">
        <div className="dashboard-header">
          <h1>Profile Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Manage your personal information and account settings
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            {success}
          </div>
        )}

        <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
          {/* Personal Information */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <h3 style={{ margin: '2rem 0 1rem 0', color: 'var(--text-primary)' }}>Emergency Contact</h3>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className="form-group">
                  <label htmlFor="emergency_contact_name">Emergency Contact Name</label>
                  <input
                    type="text"
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergency_contact_phone">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <h3 style={{ margin: '2rem 0 1rem 0', color: 'var(--text-primary)' }}>Medical Information</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="medical_conditions">Medical Conditions</label>
                  <textarea
                    id="medical_conditions"
                    name="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any medical conditions we should be aware of..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dietary_restrictions">Dietary Restrictions</label>
                  <textarea
                    id="dietary_restrictions"
                    name="dietary_restrictions"
                    value={formData.dietary_restrictions}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any dietary restrictions or allergies..."
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                <div className="form-group">
                  <label htmlFor="current_password">Current Password</label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new_password">New Password</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm_password">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile

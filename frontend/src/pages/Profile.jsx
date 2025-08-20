import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import Icon from '../components/Icon'

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
      <div className="space-y-8">
        {/* Header with Profile Overview */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-6">
            {/* Profile Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="user" size={32} className="text-primary-600" />
            </div>

            {/* Profile Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-lg text-gray-600 mb-3">
                Manage your personal information and account preferences
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Icon name="mail" size={16} />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="calendar" size={16} />
                  <span>Member since {new Date(user?.created_at || Date.now()).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-secondary">
              <Icon name="download" size={16} />
              Export Data
            </button>
            <button className="btn btn-secondary">
              <Icon name="shield" size={16} />
              Privacy Settings
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                    <Icon name="user" size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                <p className="text-gray-600 text-sm">Update your basic profile information and contact details</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <Icon name="user" size={16} className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <Icon name="mail" size={16} className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      <Icon name="phone" size={16} className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_of_birth" className="form-label">
                      <Icon name="calendar" size={16} className="inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="phone" size={18} className="text-gray-600" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="emergency_contact_name" className="form-label">Contact Name</label>
                      <input
                        type="text"
                        id="emergency_contact_name"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Emergency contact full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="emergency_contact_phone" className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        id="emergency_contact_phone"
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Emergency contact phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Icon name="refresh" size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Icon name="check" size={16} />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Medical Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                    <Icon name="alert-circle" size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
                </div>
                <p className="text-gray-600 text-sm">Provide medical details for safety during events</p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="medical_conditions" className="form-label">
                      <Icon name="alert-circle" size={16} className="inline mr-2" />
                      Medical Conditions
                    </label>
                    <textarea
                      id="medical_conditions"
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleInputChange}
                      rows="4"
                      className="form-input"
                      placeholder="Any medical conditions we should be aware of during events..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dietary_restrictions" className="form-label">
                      <Icon name="info" size={16} className="inline mr-2" />
                      Dietary Restrictions
                    </label>
                    <textarea
                      id="dietary_restrictions"
                      name="dietary_restrictions"
                      value={formData.dietary_restrictions}
                      onChange={handleInputChange}
                      rows="4"
                      className="form-input"
                      placeholder="Any dietary restrictions, allergies, or special requirements..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Security Settings Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                    <Icon name="shield" size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                </div>
                <p className="text-gray-600 text-sm">Manage your account security settings</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-6">
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="current_password" className="form-label">Current Password</label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="new_password" className="form-label">New Password</label>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                      minLength="6"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm_password" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                      minLength="6"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <Icon name="refresh" size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Icon name="shield" size={16} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Statistics Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Icon name="bar-chart" size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Account Stats</h2>
                </div>
                <p className="text-gray-600 text-sm">Your activity overview</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Icon name="calendar" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Member Since</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(user?.created_at || Date.now()).getFullYear()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Icon name="runner" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Events Joined</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">-</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Icon name="check-circle" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Events Completed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">-</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>

              <div className="p-6 space-y-3">
                <button className="w-full btn btn-secondary justify-start">
                  <Icon name="download" size={16} />
                  Download My Data
                </button>

                <button className="w-full btn btn-secondary justify-start">
                  <Icon name="bell" size={16} />
                  Notification Settings
                </button>

                <button className="w-full btn btn-secondary justify-start text-red-600 hover:text-red-700">
                  <Icon name="trash" size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile

import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import Icon from '../components/Icon'

const Settings = () => {
  const { user, isAdmin } = useAuth()
  const [settings, setSettings] = useState({
    // User settings
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    event_reminders: true,
    result_notifications: true,
    newsletter: false,
    privacy_profile: 'public', // public, friends, private
    show_results: true,
    show_upcoming_events: true,

    // Admin settings
    site_name: 'Runnio',
    site_description: 'Professional running events platform',
    registration_enabled: true,
    auto_approve_events: false,
    max_events_per_user: 10,
    email_from_name: 'Runnio Team',
    email_from_address: 'noreply@runnio.com',
    maintenance_mode: false,
    analytics_enabled: true,
    backup_frequency: 'daily'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // For now, use default settings
      // TODO: Replace with actual API call when backend is available
      setSettings({
        // User settings
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: false,
        event_reminders: true,
        result_notifications: true,
        newsletter: false,
        privacy_profile: 'public',
        show_results: true,
        show_upcoming_events: true,

        // Admin settings
        site_name: 'Runnio',
        site_description: 'Professional running events platform',
        registration_enabled: true,
        auto_approve_events: false,
        max_events_per_user: 10,
        email_from_name: 'Runnio Team',
        email_from_address: 'noreply@runnio.com',
        maintenance_mode: false,
        analytics_enabled: true,
        backup_frequency: 'daily'
      })
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // TODO: Replace with actual API call when backend is available
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess('Settings updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: isAdmin ? 'System Settings' : 'Settings', link: null }
  ]

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      padding: '1rem 0',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ flex: 1, marginRight: '1rem' }}>
        <label style={{ 
          fontWeight: '500', 
          color: 'var(--text-primary)',
          display: 'block',
          marginBottom: '0.25rem'
        }}>
          {label}
        </label>
        {description && (
          <p style={{ 
            margin: 0, 
            fontSize: '0.875rem', 
            color: 'var(--text-secondary)' 
          }}>
            {description}
          </p>
        )}
      </div>
      <div 
        onClick={onChange}
        style={{
          width: '48px',
          height: '24px',
          backgroundColor: checked ? 'var(--primary-color)' : 'var(--border-color)',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: checked ? '26px' : '2px',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }} />
      </div>
    </div>
  )

  return (
    <DashboardLayout currentPage="settings" breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        <div className="page-header">
          <div className="header-content">
            <h1>{isAdmin ? 'System Settings' : 'Settings'}</h1>
            <p>
              {isAdmin
                ? 'Configure platform settings and system preferences'
                : 'Manage your account preferences and privacy settings'
              }
            </p>
          </div>
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              <Icon name="save" size={16} />
              Save Changes
            </button>
          )}
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

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 max-w-4xl">
            {isAdmin && (
              <>
                {/* System Configuration */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <Icon name="settings" size={20} className="text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-900">System Configuration</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings.site_name}
                        onChange={(e) => handleSelectChange('site_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email From Name</label>
                      <input
                        type="text"
                        value={settings.email_from_name}
                        onChange={(e) => handleSelectChange('email_from_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                      <textarea
                        value={settings.site_description}
                        onChange={(e) => handleSelectChange('site_description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email From Address</label>
                      <input
                        type="email"
                        value={settings.email_from_address}
                        onChange={(e) => handleSelectChange('email_from_address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Events Per User</label>
                      <input
                        type="number"
                        value={settings.max_events_per_user}
                        onChange={(e) => handleSelectChange('max_events_per_user', parseInt(e.target.value))}
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Platform Settings */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <Icon name="shield" size={20} className="text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
                  </div>

                  <div className="space-y-4">
                    <ToggleSwitch
                      checked={settings.registration_enabled}
                      onChange={() => handleToggle('registration_enabled')}
                      label="User Registration Enabled"
                      description="Allow new users to register for accounts"
                    />

                    <ToggleSwitch
                      checked={settings.auto_approve_events}
                      onChange={() => handleToggle('auto_approve_events')}
                      label="Auto-approve Events"
                      description="Automatically approve new events without manual review"
                    />

                    <ToggleSwitch
                      checked={settings.maintenance_mode}
                      onChange={() => handleToggle('maintenance_mode')}
                      label="Maintenance Mode"
                      description="Put the site in maintenance mode (only admins can access)"
                    />

                    <ToggleSwitch
                      checked={settings.analytics_enabled}
                      onChange={() => handleToggle('analytics_enabled')}
                      label="Analytics Tracking"
                      description="Enable analytics and usage tracking"
                    />
                  </div>
                </div>

                {/* Backup Settings */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <Icon name="download" size={20} className="text-gray-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Backup & Maintenance</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select
                        value={settings.backup_frequency}
                        onChange={(e) => handleSelectChange('backup_frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                      <div className="flex gap-2">
                        <button type="button" className="btn btn-secondary text-sm">
                          <Icon name="download" size={14} />
                          Backup Now
                        </button>
                        <button type="button" className="btn btn-secondary text-sm">
                          <Icon name="refresh" size={14} />
                          Clear Cache
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isAdmin && (
              <>
                {/* Notification Settings */}
                <div className="card">
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Icon name="bell" size={20} /> Notification Preferences
              </h2>
              
              <ToggleSwitch
                checked={settings.email_notifications}
                onChange={() => handleToggle('email_notifications')}
                label="Email Notifications"
                description="Receive important updates and notifications via email"
              />

              <ToggleSwitch
                checked={settings.sms_notifications}
                onChange={() => handleToggle('sms_notifications')}
                label="SMS Notifications"
                description="Receive urgent notifications via text message"
              />

              <ToggleSwitch
                checked={settings.event_reminders}
                onChange={() => handleToggle('event_reminders')}
                label="Event Reminders"
                description="Get reminders about upcoming events you're registered for"
              />

              <ToggleSwitch
                checked={settings.result_notifications}
                onChange={() => handleToggle('result_notifications')}
                label="Result Notifications"
                description="Be notified when event results are published"
              />

              <ToggleSwitch
                checked={settings.marketing_emails}
                onChange={() => handleToggle('marketing_emails')}
                label="Marketing Emails"
                description="Receive promotional emails about new events and features"
              />

              <ToggleSwitch
                checked={settings.newsletter}
                onChange={() => handleToggle('newsletter')}
                label="Newsletter"
                description="Subscribe to our monthly newsletter with running tips and updates"
              />
            </div>

            {/* Privacy Settings */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Icon name="user" size={20} /> Privacy Settings
              </h2>

              <div style={{ 
                padding: '1rem 0',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Profile Visibility
                </label>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)' 
                }}>
                  Control who can see your profile information
                </p>
                <select
                  value={settings.privacy_profile}
                  onChange={(e) => handleSelectChange('privacy_profile', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="public">Public - Anyone can see</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>

              <ToggleSwitch
                checked={settings.show_results}
                onChange={() => handleToggle('show_results')}
                label="Show My Results"
                description="Allow others to see your race results and times"
              />

              <ToggleSwitch
                checked={settings.show_upcoming_events}
                onChange={() => handleToggle('show_upcoming_events')}
                label="Show Upcoming Events"
                description="Display your upcoming events on your public profile"
              />
            </div>

            {/* Account Actions */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Icon name="settings" size={20} /> Account Actions
              </h2>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    Export Data
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Download a copy of all your data including registrations and results
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => alert('Data export feature coming soon!')}
                  >
                    Export My Data
                  </button>
                </div>

                <div style={{ 
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid #fecaca'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>
                    Delete Account
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#7f1d1d' }}>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button 
                    type="button" 
                    className="btn"
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none'
                    }}
                    onClick={() => alert('Account deletion feature coming soon!')}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
              </>
            )}

            {/* Save Button - Only show for non-admin users */}
            {!isAdmin && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Icon name="save" size={16} />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default Settings

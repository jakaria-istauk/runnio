import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import Icon from '../components/Icon'

const Settings = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    event_reminders: true,
    result_notifications: true,
    newsletter: false,
    privacy_profile: 'public', // public, friends, private
    show_results: true,
    show_upcoming_events: true
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
        email_notifications: true,
        sms_notifications: false,
        marketing_emails: false,
        event_reminders: true,
        result_notifications: true,
        newsletter: false,
        privacy_profile: 'public',
        show_results: true,
        show_upcoming_events: true
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
    { label: 'Settings', link: null }
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
      <div className="dashboard-overview">
        <div className="dashboard-header">
          <h1>Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Manage your account preferences and privacy settings
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
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

            {/* Save Button */}
            <div style={{ marginTop: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ minWidth: '150px' }}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default Settings

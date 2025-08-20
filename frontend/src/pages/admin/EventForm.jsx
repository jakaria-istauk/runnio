import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../components/DashboardLayout'
import Icon from '../../components/Icon'

const EventForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'onsite',
    location: '',
    distances: ['5km'],
    event_date: '',
    registration_deadline: '',
    submission_deadline: '',
    registration_link: '',
    social_event_link: '',
    pricing: [{ distance: '5km', price: '' }]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isEdit) {
      fetchEvent()
    }
  }, [id, isEdit])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/events/${id}`)
      const event = response.data.data
      setFormData({
        name: event.name || '',
        description: event.description || '',
        type: event.type || 'onsite',
        location: event.location || '',
        distances: event.distances || ['5km'],
        event_date: event.event_date ? event.event_date.split('T')[0] : '',
        registration_deadline: event.registration_deadline || '',
        submission_deadline: event.submission_deadline || '',
        registration_link: event.metadata?.registration_link || '',
        social_event_link: event.metadata?.social_event_link || '',
        pricing: event.metadata?.pricing ? JSON.parse(event.metadata.pricing) : [{ distance: '5km', price: '' }]
      })
    } catch (err) {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePricingChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      pricing: [...prev.pricing, { distance: '', price: '' }]
    }))
  }

  const removePricingTier = (index) => {
    if (formData.pricing.length > 1) {
      setFormData(prev => ({
        ...prev,
        pricing: prev.pricing.filter((_, i) => i !== index)
      }))
    }
  }

  const handleDistanceChange = (index, value) => {
    const newDistances = [...formData.distances]
    newDistances[index] = value
    setFormData(prev => ({
      ...prev,
      distances: newDistances
    }))
  }

  const addDistance = () => {
    setFormData(prev => ({
      ...prev,
      distances: [...prev.distances, '']
    }))
  }

  const removeDistance = (index) => {
    setFormData(prev => ({
      ...prev,
      distances: prev.distances.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const submitData = {
        ...formData,
        distances: formData.distances.filter(d => d.trim() !== ''),
        metadata: {
          registration_link: formData.registration_link,
          social_event_link: formData.social_event_link,
          pricing: JSON.stringify(formData.pricing.filter(p => p.distance && p.price))
        }
      }

      if (isEdit) {
        await api.put(`/events/${id}`, submitData)
        setSuccess('Event updated successfully!')
      } else {
        await api.post('/events', submitData)
        setSuccess('Event created successfully!')
      }

      setTimeout(() => {
        navigate('/dashboard/events')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} event`)
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Event Management', link: '/dashboard/events' },
    { label: isEdit ? 'Edit Event' : 'Create Event' }
  ]

  return (
    <DashboardLayout currentPage="events" breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto">
        <div className="page-header">
          <div className="header-content">
            <h1>{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
            <p>{isEdit ? 'Update event details and settings' : 'Add a new running event to the platform'}</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter event name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Describe the event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="onsite">On Site</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>

              {formData.type === 'onsite' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required={formData.type === 'onsite'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Event location"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distances</h2>
            
            <div className="space-y-3">
              {formData.distances.map((distance, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={distance}
                    onChange={(e) => handleDistanceChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="e.g., 5km, 10km, Half Marathon"
                  />
                  {formData.distances.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDistance(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addDistance}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <Icon name="plus" size={16} />
                Add Distance
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Registration</h2>

            <div className="space-y-6">
              {/* Registration Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Link
                </label>
                <input
                  type="url"
                  name="registration_link"
                  value={formData.registration_link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="https://example.com/register"
                />
                <p className="text-sm text-gray-500 mt-1">External registration URL (optional)</p>
              </div>

              {/* Social Event Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Event Link
                </label>
                <input
                  type="url"
                  name="social_event_link"
                  value={formData.social_event_link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="https://facebook.com/event/123"
                />
                <p className="text-sm text-gray-500 mt-1">Social media or event website URL (optional)</p>
              </div>

              {/* Distance-Based Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance-Based Pricing
                </label>
                <div className="space-y-3">
                  {formData.pricing.map((pricing, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={pricing.distance}
                        onChange={(e) => handlePricingChange(index, 'distance', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      >
                        <option value="">Select Distance</option>
                        {formData.distances.map((distance, i) => (
                          <option key={i} value={distance}>{distance}</option>
                        ))}
                      </select>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">$</span>
                        <input
                          type="number"
                          value={pricing.price}
                          onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {formData.pricing.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePricingTier(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPricingTier}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Icon name="plus" size={16} />
                    Add Pricing Tier
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Set different prices for different distances (optional)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates & Deadlines</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              {formData.type === 'virtual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    name="submission_deadline"
                    value={formData.submission_deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/events')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Icon name="save" size={16} />
                  {isEdit ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default EventForm

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState([])

  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    const newErrors = []

    if (!isLogin && !formData.name.trim()) {
      newErrors.push('Name is required')
    }

    if (!formData.email.trim()) {
      newErrors.push('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Email is invalid')
    }

    if (!formData.password) {
      newErrors.push('Password is required')
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long')
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match')
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setErrors([])

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    let result
    if (isLogin) {
      result = await login(formData.email, formData.password)
    } else {
      result = await register(formData.name, formData.email, formData.password)
    }

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.message)
      if (result.errors) {
        setErrors(result.errors)
      }
    }

    setLoading(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setErrors([])
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <div className="card">
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          marginBottom: '2rem',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: 'none',
              borderBottom: isLogin ? '2px solid #007bff' : 'none',
              color: isLogin ? '#007bff' : '#666',
              fontWeight: isLogin ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: 'none',
              borderBottom: !isLogin ? '2px solid #007bff' : 'none',
              color: !isLogin ? '#007bff' : '#666',
              fontWeight: !isLogin ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          <p style={{ color: '#666' }}>
            {isLogin
              ? 'Welcome back! Please sign in to your account.'
              : 'Join our running community and start registering for events!'
            }
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {errors.length > 0 && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isLogin ? "Enter your password" : "Enter your password (min 6 characters)"}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading
              ? (isLogin ? 'Signing in...' : 'Creating Account...')
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        {isLogin && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Demo Accounts:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              <div>Admin: admin@runningevents.com / admin123</div>
              <div>User: john@example.com / user123</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#007bff',
            textDecoration: 'none'
          }}
        >
          🏃‍♂️ Runnio
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            Events
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>
                Dashboard
              </Link>

              <span style={{ color: '#666' }}>
                Welcome, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '5px 15px', fontSize: '14px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn" style={{ padding: '5px 15px', fontSize: '14px' }}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

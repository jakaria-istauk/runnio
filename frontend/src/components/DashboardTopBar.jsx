import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardTopBar = ({ user, breadcrumbs, onToggleSidebar, sidebarCollapsed }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <header className={`dashboard-topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <button 
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        
        {breadcrumbs && (
          <nav className="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="breadcrumb">
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                {crumb.link ? (
                  <a href={crumb.link} className="breadcrumb-link">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="breadcrumb-current">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="topbar-right">
        <div className="user-menu" ref={dropdownRef}>
          <button 
            className="user-button"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'User'}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-details">
                  <strong>{user?.name || 'User'}</strong>
                  <small>{user?.email || 'user@runnio.com'}</small>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/dashboard/profile')
                    }}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile Settings
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/dashboard/settings')
                    }}
                  >
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </button>
                </li>
              </ul>
              
              <div className="dropdown-divider"></div>
              
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className="dropdown-item logout"
                    onClick={() => {
                      setDropdownOpen(false)
                      handleLogout()
                    }}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardTopBar

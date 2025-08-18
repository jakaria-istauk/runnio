import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from './Icon'

const DashboardTopBar = ({ user, breadcrumbs, onToggleSidebar, onToggleMobileMenu, sidebarCollapsed }) => {
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
    <header className={`
      sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300
      ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
    `}>
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onToggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Icon name="menu" size={20} />
          </button>

          {breadcrumbs && (
            <nav className="hidden sm:flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <Icon name="chevron-right" size={16} className="text-gray-400 mx-2" />
                  )}
                  {crumb.link ? (
                    <a
                      href={crumb.link}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'User'}</div>
              </div>
              <Icon name="chevron-down" size={16} className="text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                  <div className="text-sm text-gray-500">{user?.email || 'user@runnio.com'}</div>
                </div>

                <div className="py-2">
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/dashboard/profile')
                    }}
                  >
                    <Icon name="user" size={16} className="text-gray-500" />
                    Profile Settings
                  </button>

                  <button
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/dashboard/settings')
                    }}
                  >
                    <Icon name="settings" size={16} className="text-gray-500" />
                    Settings
                  </button>

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setDropdownOpen(false)
                      handleLogout()
                    }}
                  >
                    <Icon name="logout" size={16} className="text-red-500" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardTopBar

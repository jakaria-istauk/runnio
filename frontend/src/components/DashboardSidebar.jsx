import { Link, useLocation } from 'react-router-dom'

const DashboardSidebar = ({ collapsed, onToggle, currentPage, isAdmin }) => {
  const location = useLocation()

  // User menu items (visible to all authenticated users)
  const userMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      exact: true
    },
    {
      id: 'my-events',
      label: 'My Events',
      icon: '🏃‍♂️',
      path: '/dashboard/my-events'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/dashboard/profile'
    }
  ]

  // Admin menu items (only visible to admin users)
  const adminMenuItems = [
    {
      id: 'admin-divider',
      type: 'divider',
      label: 'Administration'
    },
    {
      id: 'events',
      label: 'Manage Events',
      icon: '🏃‍♂️',
      path: '/dashboard/events'
    },
    {
      id: 'users',
      label: 'Manage Users',
      icon: '👥',
      path: '/dashboard/users'
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: '📝',
      path: '/dashboard/registrations'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/dashboard/settings'
    }
  ]

  // Combine menu items based on user role
  const menuItems = isAdmin ? [...userMenuItems, ...adminMenuItems] : userMenuItems

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏃‍♂️</span>
          {!collapsed && <span className="logo-text">Runnio</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => {
            if (item.type === 'divider') {
              return (
                <li key={item.id} className="nav-divider">
                  {!collapsed && <span className="divider-label">{item.label}</span>}
                </li>
              )
            }

            return (
              <li key={item.id} className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link ${isActive(item) ? 'active' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-info">
            <p className="version">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default DashboardSidebar

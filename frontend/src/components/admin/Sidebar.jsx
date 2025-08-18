import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ collapsed, onToggle, currentPage }) => {
  const location = useLocation()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin',
      exact: true
    },
    {
      id: 'events',
      label: 'Events',
      icon: '🏃‍♂️',
      path: '/admin/events'
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      path: '/admin/users'
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: '📝',
      path: '/admin/registrations'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/admin/settings'
    }
  ]

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏃‍♂️</span>
          {!collapsed && <span className="logo-text">Runnio Admin</span>}
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
          {menuItems.map(item => (
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
          ))}
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

export default Sidebar

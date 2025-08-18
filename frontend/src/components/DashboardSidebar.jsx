import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'

const DashboardSidebar = ({ collapsed, onToggle, currentPage, isAdmin }) => {
  const location = useLocation()

  // User menu items (visible to all authenticated users)
  const userMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
      path: '/dashboard',
      exact: true
    },
    {
      id: 'my-events',
      label: 'My Events',
      icon: 'runner',
      path: '/dashboard/my-events'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
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
      icon: 'calendar',
      path: '/dashboard/events'
    },
    {
      id: 'users',
      label: 'Manage Users',
      icon: 'users',
      path: '/dashboard/users'
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: 'file-text',
      path: '/dashboard/registrations'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
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
          <Icon name="runner" size={24} className="logo-icon" />
          {!collapsed && <span className="logo-text">Runnio</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={collapsed ? 'chevron-right' : 'menu'} size={16} />
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
                  <Icon name={item.icon} size={18} className="nav-icon" />
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

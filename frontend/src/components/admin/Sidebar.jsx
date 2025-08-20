import { Link, useLocation } from 'react-router-dom'
import { BarChart, Users, FileText, Settings } from '../icons'
import Icon from '../Icon'

const Sidebar = ({ collapsed, onToggle, currentPage }) => {
  const location = useLocation()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart className="w-5 h-5" />,
      path: '/dashboard',
      exact: true
    },
    {
      id: 'events',
      label: 'Events',
      icon: '🏃‍♂️',
      path: '/dashboard/events'
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="w-5 h-5" />,
      path: '/dashboard/users'
    },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: <FileText className="w-5 h-5" />,
      path: '/dashboard/registrations'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/dashboard/settings'
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
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} />
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
                <span className="nav-icon">
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </span>
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

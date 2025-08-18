import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'

const DashboardSidebar = ({ collapsed, mobileMenuOpen, onToggle, onMobileToggle, currentPage, isAdmin }) => {
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
    <aside className={`
      fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300
      ${collapsed ? 'w-20' : 'w-72'}
      ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Icon name="runner" size={20} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900">Runnio</span>
          )}
        </div>

        <button
          className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} />
        </button>

        <button
          className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onMobileToggle}
          aria-label="Close menu"
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
        {menuItems.map(item => {
          if (item.type === 'divider') {
            return (
              <div key={item.id} className="pt-6 pb-2">
                {!collapsed && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </h3>
                )}
                <div className="mt-2 border-t border-gray-200" />
              </div>
            )
          }

          const active = isActive(item)

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                nav-link group
                ${active ? 'nav-link-active bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'}
              `}
              title={collapsed ? item.label : ''}
              onClick={() => onMobileToggle && onMobileToggle()}
            >
              <Icon
                name={item.icon}
                size={20}
                className={`flex-shrink-0 ${active ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'}`}
              />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500">Runnio v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default DashboardSidebar

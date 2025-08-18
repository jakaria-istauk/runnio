import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopBar from './DashboardTopBar'

const DashboardLayout = ({ children, currentPage, breadcrumbs }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAdmin } = useAuth()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        onToggle={toggleSidebar}
        onMobileToggle={toggleMobileMenu}
        currentPage={currentPage}
        isAdmin={isAdmin}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar
          user={user}
          breadcrumbs={breadcrumbs}
          onToggleSidebar={toggleSidebar}
          onToggleMobileMenu={toggleMobileMenu}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  )
}

export default DashboardLayout

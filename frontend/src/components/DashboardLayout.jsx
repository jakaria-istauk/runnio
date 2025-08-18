import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopBar from './DashboardTopBar'
import './DashboardLayout.css'

const DashboardLayout = ({ children, currentPage, breadcrumbs }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, isAdmin } = useAuth()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        currentPage={currentPage}
        isAdmin={isAdmin}
      />

      <DashboardTopBar
        user={user}
        breadcrumbs={breadcrumbs}
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

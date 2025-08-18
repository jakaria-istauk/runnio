import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './AdminLayout.css'

const AdminLayout = ({ children, currentPage, breadcrumbs }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user } = useAuth()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        currentPage={currentPage}
      />

      <TopBar
        user={user}
        breadcrumbs={breadcrumbs}
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout

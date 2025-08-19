
import { Shield, User } from '../icons'

const UserTable = ({
  users, 
  loading, 
  onEdit, 
  onDelete, 
  onView, 
  pagination, 
  onPageChange 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadge = (role) => {
    const badgeClass = role === 'admin' ? 'badge-admin' : 'badge-user'
    const IconComponent = role === 'admin' ? Shield : User
    return (
      <span className={`role-badge ${badgeClass}`}>
        <IconComponent className="w-4 h-4 inline mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  const generatePageNumbers = () => {
    const pages = []
    const { current_page, total_pages } = pagination
    
    // Always show first page
    if (total_pages > 0) pages.push(1)
    
    // Show pages around current page
    const start = Math.max(2, current_page - 1)
    const end = Math.min(total_pages - 1, current_page + 1)
    
    if (start > 2) pages.push('...')
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total_pages) {
        pages.push(i)
      }
    }
    
    if (end < total_pages - 1) pages.push('...')
    
    // Always show last page
    if (total_pages > 1) pages.push(total_pages)
    
    return pages
  }

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
          <p>No users match your current filters. Try adjusting your search criteria.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Registrations</th>
              <th>Joined</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="table-row">
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                
                <td className="role-cell">
                  {getRoleBadge(user.role)}
                </td>
                
                <td className="registrations-cell">
                  <span className="registration-count">
                    {user.registrations_count}
                  </span>
                </td>
                
                <td className="date-cell">
                  {formatDate(user.created_at)}
                </td>
                
                <td className="date-cell">
                  {formatDate(user.updated_at)}
                </td>
                
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-view"
                      onClick={() => onView(user)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(user)}
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(user.id)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Page {pagination.current_page} of {pagination.total_pages} 
            ({pagination.total} total users)
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              ← Previous
            </button>
            
            <div className="page-numbers">
              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`page-number ${
                    page === pagination.current_page ? 'active' : ''
                  } ${page === '...' ? 'ellipsis' : ''}`}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={page === '...' || page === pagination.current_page}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTable

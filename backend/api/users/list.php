<?php
/**
 * List Users Endpoint
 * GET /api/users
 * Admin only - List all users with pagination and search
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Require admin authentication
$user = Auth::requireAdmin();

// Get query parameters
$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
$search = trim($_GET['search'] ?? '');
$role = trim($_GET['role'] ?? '');

$offset = ($page - 1) * $limit;

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Build WHERE clause
    $whereConditions = [];
    $params = [];
    
    if (!empty($search)) {
        $whereConditions[] = "(name LIKE ? OR email LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    if (!empty($role) && in_array($role, ['admin', 'user'])) {
        $whereConditions[] = "role = ?";
        $params[] = $role;
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM users $whereClause");
    $countStmt->execute($params);
    $totalUsers = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get users with pagination
    $stmt = $conn->prepare("
        SELECT 
            id,
            name,
            email,
            role,
            created_at,
            updated_at,
            (SELECT COUNT(*) FROM registrations WHERE user_id = users.id) as registrations_count
        FROM users 
        $whereClause
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    ");
    
    // Add pagination parameters
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format dates and remove sensitive data
    foreach ($users as &$userData) {
        $userData['created_at'] = date('Y-m-d H:i:s', strtotime($userData['created_at']));
        $userData['updated_at'] = date('Y-m-d H:i:s', strtotime($userData['updated_at']));
        $userData['registrations_count'] = intval($userData['registrations_count']);
    }
    
    $totalPages = ceil($totalUsers / $limit);
    
    Response::success([
        'users' => $users,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total' => intval($totalUsers),
            'per_page' => $limit,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ],
        'filters' => [
            'search' => $search,
            'role' => $role
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Users list error: " . $e->getMessage());
    Response::error('Failed to fetch users', 500);
}

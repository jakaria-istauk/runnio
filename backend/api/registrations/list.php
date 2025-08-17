<?php
/**
 * List All Registrations Endpoint
 * GET /api/registrations
 * Admin only
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Require admin authentication
$user = Auth::requireAdmin();

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Build query with optional filters
    $where = [];
    $params = [];
    
    // Filter by event
    if (!empty($_GET['event_id']) && is_numeric($_GET['event_id'])) {
        $where[] = "r.event_id = ?";
        $params[] = $_GET['event_id'];
    }
    
    // Filter by status
    if (!empty($_GET['status']) && in_array($_GET['status'], ['registered', 'completed', 'cancelled'])) {
        $where[] = "r.status = ?";
        $params[] = $_GET['status'];
    }
    
    // Filter by user
    if (!empty($_GET['user_id']) && is_numeric($_GET['user_id'])) {
        $where[] = "r.user_id = ?";
        $params[] = $_GET['user_id'];
    }
    
    // Search by user name or email
    if (!empty($_GET['search'])) {
        $where[] = "(u.name LIKE ? OR u.email LIKE ?)";
        $params[] = '%' . $_GET['search'] . '%';
        $params[] = '%' . $_GET['search'] . '%';
    }
    
    // Build WHERE clause
    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    
    // Pagination
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    
    // Get total count
    $countSql = "
        SELECT COUNT(*) as total
        FROM registrations r
        JOIN users u ON r.user_id = u.id
        JOIN events e ON r.event_id = e.id
        $whereClause
    ";
    
    $stmt = $conn->prepare($countSql);
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];
    
    // Get registrations with user and event details
    $sql = "
        SELECT 
            r.id,
            r.distance,
            r.status,
            r.registered_at,
            u.id as user_id,
            u.name as user_name,
            u.email as user_email,
            e.id as event_id,
            e.name as event_name,
            e.type as event_type,
            e.event_date,
            (SELECT COUNT(*) FROM user_logs ul WHERE ul.registration_id = r.id) as logs_count
        FROM registrations r
        JOIN users u ON r.user_id = u.id
        JOIN events e ON r.event_id = e.id
        $whereClause
        ORDER BY r.registered_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $registrations = $stmt->fetchAll();
    
    Response::success([
        'registrations' => $registrations,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
    
} catch (PDOException $e) {
    Response::serverError('Failed to fetch registrations');
}

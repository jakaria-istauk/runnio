<?php
/**
 * List Events Endpoint
 * GET /api/events
 * Public endpoint - no authentication required
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Build query with optional filters
    $where = [];
    $params = [];
    
    // Filter by type
    if (!empty($_GET['type']) && in_array($_GET['type'], ['virtual', 'onsite'])) {
        $where[] = "e.type = ?";
        $params[] = $_GET['type'];
    }
    
    // Filter by location (for onsite events)
    if (!empty($_GET['location'])) {
        $where[] = "e.location LIKE ?";
        $params[] = '%' . $_GET['location'] . '%';
    }
    
    // Filter by date range
    if (!empty($_GET['date_from'])) {
        $where[] = "e.event_date >= ?";
        $params[] = $_GET['date_from'];
    }
    
    if (!empty($_GET['date_to'])) {
        $where[] = "e.event_date <= ?";
        $params[] = $_GET['date_to'];
    }
    
    // Search in name and description
    if (!empty($_GET['search'])) {
        $where[] = "(e.name LIKE ? OR e.description LIKE ?)";
        $params[] = '%' . $_GET['search'] . '%';
        $params[] = '%' . $_GET['search'] . '%';
    }
    
    // Build WHERE clause
    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    
    // Pagination
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;
    
    // Get total count
    $countSql = "
        SELECT COUNT(*) as total
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        $whereClause
    ";
    
    $stmt = $conn->prepare($countSql);
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];
    
    // Get events with creator info
    $sql = "
        SELECT 
            e.id,
            e.name,
            e.description,
            e.type,
            e.location,
            e.distances,
            e.event_date,
            e.registration_deadline,
            e.submission_deadline,
            e.created_at,
            u.name as created_by_name
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        $whereClause
        ORDER BY e.event_date ASC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll();
    
    // Parse distances JSON for each event
    foreach ($events as &$event) {
        $event['distances'] = json_decode($event['distances'], true) ?: [];
    }
    
    Response::success([
        'events' => $events,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
    
} catch (PDOException $e) {
    Response::serverError('Failed to fetch events');
}

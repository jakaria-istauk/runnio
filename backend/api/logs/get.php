<?php
/**
 * Get Registration Logs Endpoint
 * GET /api/registrations/:id/logs
 * Users can view their own logs, admins can view any logs
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

$registrationId = $_GET['registration_id'] ?? null;

if (!$registrationId || !is_numeric($registrationId)) {
    Response::error('Invalid registration ID', 400);
}

// Require authentication
$currentUser = Auth::requireAuth();

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Get registration details and check ownership
    $stmt = $conn->prepare("
        SELECT 
            r.id,
            r.user_id,
            r.distance,
            r.status,
            e.id as event_id,
            e.name as event_name,
            e.type as event_type,
            e.event_date,
            u.name as user_name
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
    ");
    
    $stmt->execute([$registrationId]);
    $registration = $stmt->fetch();
    
    if (!$registration) {
        Response::notFound('Registration not found');
    }
    
    // Check permissions (user can view own logs, admin can view all)
    if ($currentUser['role'] !== 'admin' && $currentUser['id'] != $registration['user_id']) {
        Response::forbidden('Access denied');
    }
    
    // Get logs for this registration
    $stmt = $conn->prepare("
        SELECT 
            id,
            pace,
            finish_time,
            distance_completed,
            notes,
            submitted_at,
            updated_at
        FROM user_logs
        WHERE registration_id = ?
        ORDER BY submitted_at DESC
    ");
    
    $stmt->execute([$registrationId]);
    $logs = $stmt->fetchAll();
    
    Response::success([
        'registration' => $registration,
        'logs' => $logs
    ]);
    
} catch (PDOException $e) {
    Response::serverError('Failed to fetch logs');
}

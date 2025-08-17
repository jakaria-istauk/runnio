<?php
/**
 * Get User Registrations Endpoint
 * GET /api/users/:id/registrations
 * Users can view their own registrations, admins can view any user's registrations
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId || !is_numeric($userId)) {
    Response::error('Invalid user ID', 400);
}

// Require authentication and check permissions
$currentUser = Auth::requireOwnerOrAdmin($userId);

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Get user's registrations with event details
    $stmt = $conn->prepare("
        SELECT 
            r.id,
            r.distance,
            r.status,
            r.registered_at,
            e.id as event_id,
            e.name as event_name,
            e.description as event_description,
            e.type as event_type,
            e.location as event_location,
            e.event_date,
            e.registration_deadline,
            e.submission_deadline,
            (SELECT COUNT(*) FROM user_logs ul WHERE ul.registration_id = r.id) as has_logs
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.user_id = ?
        ORDER BY e.event_date DESC
    ");
    
    $stmt->execute([$userId]);
    $registrations = $stmt->fetchAll();
    
    // Categorize registrations
    $upcoming = [];
    $past = [];
    $now = time();
    
    foreach ($registrations as $registration) {
        $eventTime = strtotime($registration['event_date']);
        
        if ($eventTime > $now) {
            $upcoming[] = $registration;
        } else {
            $past[] = $registration;
        }
    }
    
    Response::success([
        'upcoming' => $upcoming,
        'past' => $past,
        'total' => count($registrations)
    ]);
    
} catch (PDOException $e) {
    Response::serverError('Failed to fetch registrations');
}

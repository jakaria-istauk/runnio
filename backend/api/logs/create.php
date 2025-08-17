<?php
/**
 * Create Registration Log Endpoint
 * POST /api/registrations/:id/logs
 * Users can create logs for their own registrations, admins can create logs for any registration
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$errors = [];

if (empty($input['finish_time'])) {
    $errors[] = 'Finish time is required';
}

if (empty($input['distance_completed'])) {
    $errors[] = 'Distance completed is required';
}

// Validate time format (basic validation)
if (!empty($input['finish_time']) && !preg_match('/^\d{1,2}:\d{2}:\d{2}$/', $input['finish_time'])) {
    $errors[] = 'Finish time must be in HH:MM:SS format';
}

// Validate pace format if provided
if (!empty($input['pace']) && !preg_match('/^\d{1,2}:\d{2}/', $input['pace'])) {
    $errors[] = 'Pace must be in MM:SS format (e.g., 5:30)';
}

if (!empty($errors)) {
    Response::error('Validation failed', 400, $errors);
}

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
            e.submission_deadline
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.id = ?
    ");
    
    $stmt->execute([$registrationId]);
    $registration = $stmt->fetch();
    
    if (!$registration) {
        Response::notFound('Registration not found');
    }
    
    // Check permissions (user can create logs for own registrations, admin can create for any)
    if ($currentUser['role'] !== 'admin' && $currentUser['id'] != $registration['user_id']) {
        Response::forbidden('Access denied');
    }
    
    // Check submission deadline for virtual events
    if ($registration['event_type'] === 'virtual' && 
        $registration['submission_deadline'] && 
        date('Y-m-d') > $registration['submission_deadline']) {
        Response::error('Submission deadline has passed', 409);
    }
    
    // Create log entry
    $stmt = $conn->prepare("
        INSERT INTO user_logs (
            registration_id, 
            pace, 
            finish_time, 
            distance_completed, 
            notes
        ) VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $registrationId,
        $input['pace'] ?? null,
        $input['finish_time'],
        $input['distance_completed'],
        $input['notes'] ?? null
    ]);
    
    $logId = $conn->lastInsertId();
    
    // Update registration status to completed if not already
    if ($registration['status'] === 'registered') {
        $stmt = $conn->prepare("UPDATE registrations SET status = 'completed' WHERE id = ?");
        $stmt->execute([$registrationId]);
    }
    
    // Fetch the created log
    $stmt = $conn->prepare("
        SELECT 
            id,
            pace,
            finish_time,
            distance_completed,
            notes,
            submitted_at
        FROM user_logs
        WHERE id = ?
    ");
    
    $stmt->execute([$logId]);
    $log = $stmt->fetch();
    
    Response::success($log, 'Log submitted successfully');
    
} catch (PDOException $e) {
    Response::serverError('Failed to create log');
}

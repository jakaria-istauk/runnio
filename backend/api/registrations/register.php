<?php
/**
 * Event Registration Endpoint
 * POST /api/events/:id/register
 * Authenticated users only
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Require user authentication
$user = Auth::requireAuth();

$eventId = $_GET['event_id'] ?? null;

if (!$eventId || !is_numeric($eventId)) {
    Response::error('Invalid event ID', 400);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate distance selection
if (empty($input['distance'])) {
    Response::error('Distance selection is required', 400);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if event exists and get details
    $stmt = $conn->prepare("
        SELECT id, name, distances, registration_deadline, event_date
        FROM events 
        WHERE id = ?
    ");
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    
    if (!$event) {
        Response::notFound('Event not found');
    }
    
    // Check registration deadline
    if ($event['registration_deadline'] && date('Y-m-d') > $event['registration_deadline']) {
        Response::error('Registration deadline has passed', 409);
    }
    
    // Check if event has already occurred
    if (strtotime($event['event_date']) < time()) {
        Response::error('Cannot register for past events', 409);
    }
    
    // Validate selected distance
    $availableDistances = json_decode($event['distances'], true) ?: [];
    if (!in_array($input['distance'], $availableDistances)) {
        Response::error('Invalid distance selection', 400);
    }
    
    // Check if user is already registered
    $stmt = $conn->prepare("
        SELECT id FROM registrations 
        WHERE user_id = ? AND event_id = ?
    ");
    $stmt->execute([$user['id'], $eventId]);
    
    if ($stmt->fetch()) {
        Response::error('Already registered for this event', 409);
    }
    
    // Check max participants limit (if set in metadata)
    $stmt = $conn->prepare("
        SELECT meta_value FROM event_meta 
        WHERE event_id = ? AND meta_key = 'max_participants'
    ");
    $stmt->execute([$eventId]);
    $maxParticipants = $stmt->fetch();
    
    if ($maxParticipants && $maxParticipants['meta_value'] !== 'unlimited') {
        $stmt = $conn->prepare("
            SELECT COUNT(*) as count FROM registrations 
            WHERE event_id = ? AND status = 'registered'
        ");
        $stmt->execute([$eventId]);
        $currentCount = $stmt->fetch()['count'];
        
        if ($currentCount >= intval($maxParticipants['meta_value'])) {
            Response::error('Event is full', 409);
        }
    }
    
    // Create registration
    $stmt = $conn->prepare("
        INSERT INTO registrations (user_id, event_id, distance, status) 
        VALUES (?, ?, ?, 'registered')
    ");
    $stmt->execute([$user['id'], $eventId, $input['distance']]);
    $registrationId = $conn->lastInsertId();
    
    // Fetch registration details
    $stmt = $conn->prepare("
        SELECT 
            r.id,
            r.distance,
            r.status,
            r.registered_at,
            e.name as event_name,
            e.event_date,
            e.type,
            e.location
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.id = ?
    ");
    $stmt->execute([$registrationId]);
    $registration = $stmt->fetch();
    
    Response::success($registration, 'Successfully registered for event');
    
} catch (PDOException $e) {
    Response::serverError('Registration failed');
}

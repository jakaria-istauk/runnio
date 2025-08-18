<?php
/**
 * Create Event Endpoint
 * POST /api/events
 * Admin only
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Require admin authentication
$user = Auth::requireAdmin();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'description', 'type', 'distances', 'event_date', 'registration_deadline'];
$errors = [];

foreach ($required as $field) {
    if (empty($input[$field])) {
        $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
    }
}

// Validate event type
if (!empty($input['type']) && !in_array($input['type'], ['virtual', 'onsite'])) {
    $errors[] = 'Event type must be either "virtual" or "onsite"';
}

// Validate location for onsite events
if (!empty($input['type']) && $input['type'] === 'onsite' && empty($input['location'])) {
    $errors[] = 'Location is required for onsite events';
}

// Validate distances array
if (!empty($input['distances']) && !is_array($input['distances'])) {
    $errors[] = 'Distances must be an array';
}

// Validate dates
if (!empty($input['event_date']) && !strtotime($input['event_date'])) {
    $errors[] = 'Invalid event date format';
}

if (!empty($input['registration_deadline']) && !strtotime($input['registration_deadline'])) {
    $errors[] = 'Invalid registration deadline format';
}

if (!empty($errors)) {
    Response::error('Validation failed', 400, $errors);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Prepare event data
    $eventData = [
        'name' => $input['name'],
        'description' => $input['description'],
        'cover_image' => $input['cover_image'] ?? null,
        'type' => $input['type'],
        'location' => $input['type'] === 'onsite' ? $input['location'] : null,
        'distances' => json_encode($input['distances']),
        'event_date' => $input['event_date'],
        'created_by' => $user['id'],
        'registration_deadline' => $input['registration_deadline'],
        'submission_deadline' => $input['submission_deadline'] ?? null
    ];

    // Insert event
    $stmt = $conn->prepare("
        INSERT INTO events (
            name, description, cover_image, type, location, distances,
            event_date, created_by, registration_deadline, submission_deadline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute(array_values($eventData));
    $eventId = $conn->lastInsertId();
    
    // Insert metadata if provided
    if (!empty($input['metadata']) && is_array($input['metadata'])) {
        $metaStmt = $conn->prepare("
            INSERT INTO event_meta (event_id, meta_key, meta_value) 
            VALUES (?, ?, ?)
        ");
        
        foreach ($input['metadata'] as $key => $value) {
            $metaStmt->execute([$eventId, $key, $value]);
        }
    }
    
    // Fetch the created event
    $stmt = $conn->prepare("
        SELECT
            e.id, e.name, e.description, e.cover_image, e.type, e.location, e.distances,
            e.event_date, e.registration_deadline, e.submission_deadline,
            e.created_at, u.name as created_by_name
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.id = ?
    ");
    
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    $event['distances'] = json_decode($event['distances'], true);
    
    Response::success($event, 'Event created successfully');
    
} catch (PDOException $e) {
    Response::serverError('Failed to create event');
}

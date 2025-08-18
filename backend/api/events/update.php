<?php
/**
 * Update Event Endpoint
 * PUT /api/events/:id
 * Admin only
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Require admin authentication
$user = Auth::requireAdmin();

$eventId = $_GET['id'] ?? null;

if (!$eventId || !is_numeric($eventId)) {
    Response::error('Invalid event ID', 400);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if event exists
    $stmt = $conn->prepare("SELECT id FROM events WHERE id = ?");
    $stmt->execute([$eventId]);
    
    if (!$stmt->fetch()) {
        Response::notFound('Event not found');
    }
    
    // Build update query dynamically
    $updateFields = [];
    $params = [];
    
    $allowedFields = [
        'name', 'description', 'cover_image', 'type', 'location',
        'event_date', 'registration_deadline', 'submission_deadline'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            $params[] = $input[$field];
        }
    }
    
    // Handle distances separately (JSON encoding)
    if (isset($input['distances']) && is_array($input['distances'])) {
        $updateFields[] = "distances = ?";
        $params[] = json_encode($input['distances']);
    }
    
    if (empty($updateFields)) {
        Response::error('No valid fields to update', 400);
    }
    
    // Add event ID to params
    $params[] = $eventId;
    
    // Update event
    $sql = "UPDATE events SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    // Update metadata if provided
    if (isset($input['metadata']) && is_array($input['metadata'])) {
        // Delete existing metadata
        $stmt = $conn->prepare("DELETE FROM event_meta WHERE event_id = ?");
        $stmt->execute([$eventId]);
        
        // Insert new metadata
        $metaStmt = $conn->prepare("
            INSERT INTO event_meta (event_id, meta_key, meta_value) 
            VALUES (?, ?, ?)
        ");
        
        foreach ($input['metadata'] as $key => $value) {
            $metaStmt->execute([$eventId, $key, $value]);
        }
    }
    
    // Fetch updated event
    $stmt = $conn->prepare("
        SELECT
            e.id, e.name, e.description, e.cover_image, e.type, e.location, e.distances,
            e.event_date, e.registration_deadline, e.submission_deadline,
            e.created_at, e.updated_at, u.name as created_by_name
        FROM events e
        LEFT JOIN users u ON e.created_by = u.id
        WHERE e.id = ?
    ");
    
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    $event['distances'] = json_decode($event['distances'], true);
    
    Response::success($event, 'Event updated successfully');
    
} catch (PDOException $e) {
    Response::serverError('Failed to update event');
}

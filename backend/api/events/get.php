<?php
/**
 * Get Single Event Endpoint
 * GET /api/events/:id
 * Public endpoint - no authentication required
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';

$eventId = $_GET['id'] ?? null;

if (!$eventId || !is_numeric($eventId)) {
    Response::error('Invalid event ID', 400);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Get event with creator info
    $stmt = $conn->prepare("
        SELECT
            e.id,
            e.name,
            e.description,
            e.cover_image,
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
        WHERE e.id = ?
    ");
    
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    
    if (!$event) {
        Response::notFound('Event not found');
    }
    
    // Parse distances JSON
    $event['distances'] = json_decode($event['distances'], true) ?: [];
    
    // Get event metadata
    $stmt = $conn->prepare("
        SELECT meta_key, meta_value 
        FROM event_meta 
        WHERE event_id = ?
    ");
    
    $stmt->execute([$eventId]);
    $metadata = $stmt->fetchAll();
    
    $event['metadata'] = [];
    foreach ($metadata as $meta) {
        $event['metadata'][$meta['meta_key']] = $meta['meta_value'];
    }
    
    // Get registration count
    $stmt = $conn->prepare("
        SELECT COUNT(*) as registration_count
        FROM registrations 
        WHERE event_id = ? AND status = 'registered'
    ");
    
    $stmt->execute([$eventId]);
    $event['registration_count'] = $stmt->fetch()['registration_count'];
    
    Response::success($event);
    
} catch (PDOException $e) {
    Response::serverError('Failed to fetch event');
}

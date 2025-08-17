<?php
/**
 * Delete Event Endpoint
 * DELETE /api/events/:id
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

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if event exists
    $stmt = $conn->prepare("SELECT id, name FROM events WHERE id = ?");
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();
    
    if (!$event) {
        Response::notFound('Event not found');
    }
    
    // Check if there are any registrations
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM registrations WHERE event_id = ?");
    $stmt->execute([$eventId]);
    $registrationCount = $stmt->fetch()['count'];
    
    if ($registrationCount > 0) {
        Response::error('Cannot delete event with existing registrations', 409);
    }
    
    // Delete event (cascade will handle metadata)
    $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
    $stmt->execute([$eventId]);
    
    Response::success(null, 'Event deleted successfully');
    
} catch (PDOException $e) {
    Response::serverError('Failed to delete event');
}

<?php
/**
 * Delete User Endpoint
 * DELETE /api/users/:id
 * Admin only - Delete a user and all related data
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Require admin authentication
$currentUser = Auth::requireAdmin();

$userId = $_GET['id'] ?? null;

if (!$userId || !is_numeric($userId)) {
    Response::error('Invalid user ID', 400);
}

// Prevent admin from deleting themselves
if ($userId == $currentUser['id']) {
    Response::error('You cannot delete your own account', 403);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        Response::error('User not found', 404);
    }
    
    // Start transaction for data integrity
    $conn->beginTransaction();
    
    try {
        // Get user's registrations for cleanup
        $stmt = $conn->prepare("SELECT id FROM registrations WHERE user_id = ?");
        $stmt->execute([$userId]);
        $registrationIds = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Delete user logs first (foreign key constraint)
        if (!empty($registrationIds)) {
            $placeholders = str_repeat('?,', count($registrationIds) - 1) . '?';
            $stmt = $conn->prepare("DELETE FROM user_logs WHERE registration_id IN ($placeholders)");
            $stmt->execute($registrationIds);
        }
        
        // Delete user registrations
        $stmt = $conn->prepare("DELETE FROM registrations WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        // Finally delete the user
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        // Commit transaction
        $conn->commit();
        
        Response::success([
            'message' => 'User deleted successfully',
            'deleted_user' => [
                'id' => intval($user['id']),
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ],
            'cleanup' => [
                'registrations_deleted' => count($registrationIds),
                'logs_deleted' => true
            ]
        ]);
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("User deletion error: " . $e->getMessage());
    Response::error('Failed to delete user', 500);
}

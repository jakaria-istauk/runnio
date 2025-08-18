<?php
/**
 * Update User Endpoint
 * PUT /api/users/:id
 * Admin only - Update user information
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    Response::error('Invalid JSON input', 400);
}

// Validate required fields
$requiredFields = ['name', 'email', 'role'];
foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        Response::error("Field '$field' is required", 400);
    }
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    Response::error('Invalid email format', 400);
}

// Validate role
if (!in_array($input['role'], ['admin', 'user'])) {
    Response::error('Invalid role. Must be "admin" or "user"', 400);
}

// Prevent admin from demoting themselves
if ($userId == $currentUser['id'] && $input['role'] !== 'admin') {
    Response::error('You cannot change your own admin role', 403);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$existingUser) {
        Response::error('User not found', 404);
    }
    
    // Check if email is already taken by another user
    if ($existingUser['email'] !== $input['email']) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$input['email'], $userId]);
        
        if ($stmt->fetch()) {
            Response::error('Email already exists', 409);
        }
    }
    
    // Update user
    $updateFields = ['name', 'email', 'role'];
    $updateData = [];
    
    foreach ($updateFields as $field) {
        $updateData[$field] = trim($input[$field]);
    }
    
    // Handle password update if provided
    if (!empty($input['password'])) {
        if (strlen($input['password']) < 6) {
            Response::error('Password must be at least 6 characters long', 400);
        }
        $updateData['password'] = Auth::hashPassword($input['password']);
    }
    
    // Build update query
    $setClause = [];
    $params = [];
    
    foreach ($updateData as $field => $value) {
        $setClause[] = "$field = ?";
        $params[] = $value;
    }
    
    $params[] = $userId; // for WHERE clause
    
    $stmt = $conn->prepare("
        UPDATE users 
        SET " . implode(', ', $setClause) . ", updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    
    $stmt->execute($params);
    
    // Get updated user data
    $stmt = $conn->prepare("
        SELECT 
            id,
            name,
            email,
            role,
            created_at,
            updated_at,
            (SELECT COUNT(*) FROM registrations WHERE user_id = users.id) as registrations_count
        FROM users 
        WHERE id = ?
    ");
    
    $stmt->execute([$userId]);
    $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Format dates
    $updatedUser['created_at'] = date('Y-m-d H:i:s', strtotime($updatedUser['created_at']));
    $updatedUser['updated_at'] = date('Y-m-d H:i:s', strtotime($updatedUser['updated_at']));
    $updatedUser['registrations_count'] = intval($updatedUser['registrations_count']);
    
    Response::success([
        'message' => 'User updated successfully',
        'user' => $updatedUser
    ]);
    
} catch (Exception $e) {
    error_log("User update error: " . $e->getMessage());
    Response::error('Failed to update user', 500);
}

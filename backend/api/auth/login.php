<?php
/**
 * User Login Endpoint
 * POST /api/login
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../utils/JWT.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($input['email']) || empty($input['password'])) {
    Response::error('Email and password are required', 400);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Find user by email
    $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$input['email']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        Response::error('Invalid credentials', 401);
    }
    
    // Verify password
    if (!Auth::verifyPassword($input['password'], $user['password'])) {
        Response::error('Invalid credentials', 401);
    }
    
    // Generate JWT token
    $payload = [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role']
    ];
    
    $token = JWT::encode($payload);
    
    Response::success([
        'user' => $payload,
        'token' => $token
    ], 'Login successful');
    
} catch (PDOException $e) {
    Response::serverError('Login failed');
}

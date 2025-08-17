<?php
/**
 * User Registration Endpoint
 * POST /api/register
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'email', 'password'];
$errors = [];

foreach ($required as $field) {
    if (empty($input[$field])) {
        $errors[] = ucfirst($field) . ' is required';
    }
}

// Validate email format
if (!empty($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

// Validate password strength
if (!empty($input['password']) && strlen($input['password']) < 6) {
    $errors[] = 'Password must be at least 6 characters long';
}

if (!empty($errors)) {
    Response::error('Validation failed', 400, $errors);
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$input['email']]);
    
    if ($stmt->fetch()) {
        Response::error('Email already registered', 409);
    }
    
    // Hash password
    $hashedPassword = Auth::hashPassword($input['password']);
    
    // Insert new user
    $stmt = $conn->prepare("
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, 'user')
    ");
    
    $stmt->execute([
        $input['name'],
        $input['email'],
        $hashedPassword
    ]);
    
    $userId = $conn->lastInsertId();
    
    // Generate JWT token
    $payload = [
        'id' => $userId,
        'email' => $input['email'],
        'name' => $input['name'],
        'role' => 'user'
    ];
    
    $token = JWT::encode($payload);
    
    Response::success([
        'user' => $payload,
        'token' => $token
    ], 'User registered successfully');
    
} catch (PDOException $e) {
    Response::serverError('Registration failed');
}

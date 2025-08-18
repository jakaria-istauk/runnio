<?php
/**
 * Update admin user role
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Update the admin user role
    $stmt = $conn->prepare("UPDATE users SET role = 'admin' WHERE email = ?");
    $result = $stmt->execute(['admin@runnio.com']);
    
    if ($result) {
        echo "Admin role updated successfully for admin@runnio.com\n";
    } else {
        echo "Failed to update admin role\n";
    }
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}

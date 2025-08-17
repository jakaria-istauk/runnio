<?php
/**
 * Authentication Utility Class
 * Handles user authentication and authorization
 */

require_once __DIR__ . '/JWT.php';
require_once __DIR__ . '/Response.php';

class Auth {
    
    public static function getAuthUser() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return null;
        }
        
        $token = $matches[1];
        $payload = JWT::decode($token);
        
        if (!$payload) {
            return null;
        }
        
        return $payload;
    }
    
    public static function requireAuth() {
        $user = self::getAuthUser();
        
        if (!$user) {
            Response::unauthorized('Authentication required');
        }
        
        return $user;
    }
    
    public static function requireAdmin() {
        $user = self::requireAuth();
        
        if ($user['role'] !== 'admin') {
            Response::forbidden('Admin access required');
        }
        
        return $user;
    }
    
    public static function requireOwnerOrAdmin($userId) {
        $user = self::requireAuth();
        
        if ($user['role'] !== 'admin' && $user['id'] != $userId) {
            Response::forbidden('Access denied');
        }
        
        return $user;
    }
    
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
}

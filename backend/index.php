<?php
/**
 * Main API Router
 * Running Events Management System
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/utils/Response.php';

// Handle CORS preflight
Response::cors();

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/backend', '', $path); // Remove backend prefix if present

// Route the request
try {
    switch (true) {
        // Health check endpoint
        case $path === '/api/health' && $method === 'GET':
            require_once __DIR__ . '/api/health.php';
            break;

        // Authentication routes
        case $path === '/api/register' && $method === 'POST':
            require_once __DIR__ . '/api/auth/register.php';
            break;

        case $path === '/api/login' && $method === 'POST':
            require_once __DIR__ . '/api/auth/login.php';
            break;
            
        // Events routes
        case $path === '/api/events' && $method === 'GET':
            require_once __DIR__ . '/api/events/list.php';
            break;
            
        case preg_match('/^\/api\/events\/(\d+)$/', $path, $matches) && $method === 'GET':
            $_GET['id'] = $matches[1];
            require_once __DIR__ . '/api/events/get.php';
            break;
            
        case $path === '/api/events' && $method === 'POST':
            require_once __DIR__ . '/api/events/create.php';
            break;
            
        case preg_match('/^\/api\/events\/(\d+)$/', $path, $matches) && $method === 'PUT':
            $_GET['id'] = $matches[1];
            require_once __DIR__ . '/api/events/update.php';
            break;
            
        case preg_match('/^\/api\/events\/(\d+)$/', $path, $matches) && $method === 'DELETE':
            $_GET['id'] = $matches[1];
            require_once __DIR__ . '/api/events/delete.php';
            break;
            
        // Registration routes
        case preg_match('/^\/api\/events\/(\d+)\/register$/', $path, $matches) && $method === 'POST':
            $_GET['event_id'] = $matches[1];
            require_once __DIR__ . '/api/registrations/register.php';
            break;
            
        case preg_match('/^\/api\/users\/(\d+)\/registrations$/', $path, $matches) && $method === 'GET':
            $_GET['user_id'] = $matches[1];
            require_once __DIR__ . '/api/registrations/user_registrations.php';
            break;
            
        case $path === '/api/registrations' && $method === 'GET':
            require_once __DIR__ . '/api/registrations/list.php';
            break;
            
        // User logs routes
        case preg_match('/^\/api\/registrations\/(\d+)\/logs$/', $path, $matches) && $method === 'GET':
            $_GET['registration_id'] = $matches[1];
            require_once __DIR__ . '/api/logs/get.php';
            break;
            
        case preg_match('/^\/api\/registrations\/(\d+)\/logs$/', $path, $matches) && $method === 'POST':
            $_GET['registration_id'] = $matches[1];
            require_once __DIR__ . '/api/logs/create.php';
            break;
            
        default:
            // Check if this is an API route that doesn't exist
            if (strpos($path, '/api/') === 0) {
                Response::notFound('Endpoint not found');
            } else {
                // Serve the web UI for non-API routes
                require_once __DIR__ . '/ui/index.php';
            }
    }
} catch (Exception $e) {
    if (APP_ENV === 'development') {
        Response::serverError('Server error: ' . $e->getMessage());
    } else {
        Response::serverError('Internal server error');
    }
}

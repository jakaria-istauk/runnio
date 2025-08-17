<?php
/**
 * Health Check Endpoint
 * Returns system health status and information
 */

// Get system information
$health_data = [
    'status' => 'healthy',
    'timestamp' => date('c'), // ISO 8601 format
    'app' => [
        'name' => APP_NAME,
        'version' => APP_VERSION,
        'environment' => APP_ENV
    ],
    'system' => [
        'php_version' => PHP_VERSION,
        'memory_usage' => [
            'current' => memory_get_usage(true),
            'peak' => memory_get_peak_usage(true),
            'formatted' => [
                'current' => formatBytes(memory_get_usage(true)),
                'peak' => formatBytes(memory_get_peak_usage(true))
            ]
        ],
        'uptime' => getServerUptime()
    ]
];

// Helper function to format bytes
function formatBytes($bytes, $precision = 2) {
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    
    for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
        $bytes /= 1024;
    }
    
    return round($bytes, $precision) . ' ' . $units[$i];
}

// Helper function to get server uptime (simplified)
function getServerUptime() {
    if (function_exists('sys_getloadavg') && is_readable('/proc/uptime')) {
        $uptime = file_get_contents('/proc/uptime');
        $uptime = explode(' ', $uptime);
        $seconds = (int)$uptime[0];
        
        $days = floor($seconds / 86400);
        $hours = floor(($seconds % 86400) / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        
        return sprintf('%d days, %d hours, %d minutes', $days, $hours, $minutes);
    }
    
    return 'Unknown';
}

// Return health response
Response::success($health_data, 'System is healthy');

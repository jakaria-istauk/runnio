<?php
/**
 * Database Setup Script
 * Running Events Management System
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

function runMigrations() {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        die("Database connection failed!\n");
    }
    
    $migrationFiles = [
        '001_create_users_table.sql',
        '002_create_events_table.sql',
        '003_create_event_meta_table.sql',
        '004_create_registrations_table.sql',
        '005_create_user_logs_table.sql',
        '006_insert_sample_data.sql',
        '007_add_cover_image_to_events.sql',
        '007_insert_bangladesh_sample_data.sql'
    ];
    
    echo "Running database migrations...\n";
    
    foreach ($migrationFiles as $file) {
        $filePath = __DIR__ . '/migrations/' . $file;
        
        if (!file_exists($filePath)) {
            echo "Migration file not found: $file\n";
            continue;
        }
        
        $sql = file_get_contents($filePath);
        
        try {
            // Split SQL file by semicolons and execute each statement
            $statements = array_filter(array_map('trim', explode(';', $sql)));
            
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    $conn->exec($statement);
                }
            }
            
            echo "✓ Executed: $file\n";
        } catch (PDOException $e) {
            echo "✗ Error in $file: " . $e->getMessage() . "\n";
        }
    }
    
    echo "Database setup completed!\n";
}

// Run migrations if script is called directly
if (php_sapi_name() === 'cli') {
    runMigrations();
}

<?php
/**
 * Database Configuration
 * Running Events Management System
 */

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->db_name = $_ENV['DB_NAME'] ?? 'running_events';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
    }

    public function getConnection() {
        $this->conn = null;

        try {
            // Build DSN with port and socket options for better compatibility
            $port = $_ENV['DB_PORT'] ?? '3306';
            $socket = $_ENV['DB_SOCKET'] ?? null;

            if ($socket) {
                // Use Unix socket if specified
                $dsn = "mysql:unix_socket=" . $socket . ";dbname=" . $this->db_name;
            } else {
                // Use TCP connection with explicit port
                $dsn = "mysql:host=" . $this->host . ";port=" . $port . ";dbname=" . $this->db_name;
            }

            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            echo "Connection error: " . $exception->getMessage();
            return null;
        }

        return $this->conn;
    }
}

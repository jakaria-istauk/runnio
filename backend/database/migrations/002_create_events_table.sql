-- Create events table
-- Running Events Management System

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('virtual', 'onsite') NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    distances VARCHAR(255), -- JSON string of available distances
    event_date DATETIME NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    registration_deadline DATE,
    submission_deadline DATE, -- For virtual events only
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_registration_deadline ON events(registration_deadline);
CREATE INDEX idx_events_created_by ON events(created_by);

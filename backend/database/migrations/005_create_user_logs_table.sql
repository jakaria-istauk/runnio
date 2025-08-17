-- Create user_logs table
-- Running Events Management System
-- Stores race results and performance data

CREATE TABLE IF NOT EXISTS user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    pace VARCHAR(50), -- e.g., "5:30 min/km"
    finish_time VARCHAR(50), -- e.g., "1:45:30"
    distance_completed VARCHAR(50), -- Actual distance completed
    notes TEXT, -- Additional notes from user
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_logs_registration_id ON user_logs(registration_id);
CREATE INDEX idx_user_logs_submitted_at ON user_logs(submitted_at);

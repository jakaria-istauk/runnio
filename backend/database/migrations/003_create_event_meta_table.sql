-- Create event_meta table
-- Running Events Management System
-- WordPress-style metadata table for flexible event properties

CREATE TABLE IF NOT EXISTS event_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    meta_key VARCHAR(100) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_event_meta_event_id ON event_meta(event_id);
CREATE INDEX idx_event_meta_key ON event_meta(meta_key);
CREATE INDEX idx_event_meta_event_key ON event_meta(event_id, meta_key);

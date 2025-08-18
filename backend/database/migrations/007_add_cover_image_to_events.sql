-- Add cover_image field to events table
-- Running Events Management System

ALTER TABLE events 
ADD COLUMN cover_image VARCHAR(500) DEFAULT NULL AFTER description;

-- Add index for better performance when filtering by cover image presence
CREATE INDEX idx_events_cover_image ON events(cover_image);

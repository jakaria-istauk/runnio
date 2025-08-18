-- Insert sample data
-- Runnio - Running Events Management System

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@runnio.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample regular users (password: user123)
INSERT INTO users (name, email, password, role) VALUES 
('John Runner', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Sarah Marathon', 'sarah@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Mike Sprint', 'mike@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert sample events
INSERT INTO events (name, description, type, location, distances, event_date, created_by, registration_deadline, submission_deadline) VALUES 
(
    'City Marathon 2024',
    'Annual city marathon with multiple distance options. Join thousands of runners in this exciting event!',
    'onsite',
    'Central Park, New York',
    '["5km", "10km", "21km", "42km"]',
    '2024-09-15 08:00:00',
    1,
    '2024-09-01',
    NULL
),
(
    'Virtual Summer Challenge',
    'Complete your run anywhere, anytime during the challenge period. Perfect for busy schedules!',
    'virtual',
    NULL,
    '["5km", "10km", "15km"]',
    '2024-08-01 00:00:00',
    1,
    '2024-07-25',
    '2024-08-31'
),
(
    'Trail Running Adventure',
    'Experience the beauty of nature while challenging yourself on scenic trails.',
    'onsite',
    'Mountain Trail Park, Colorado',
    '["10km", "21km"]',
    '2024-10-20 09:00:00',
    1,
    '2024-10-10',
    NULL
);

-- Insert sample event metadata
INSERT INTO event_meta (event_id, meta_key, meta_value) VALUES 
(1, 'entry_fee', '50'),
(1, 'max_participants', '5000'),
(1, 'difficulty_level', 'intermediate'),
(2, 'entry_fee', '25'),
(2, 'max_participants', 'unlimited'),
(2, 'difficulty_level', 'beginner'),
(3, 'entry_fee', '40'),
(3, 'max_participants', '500'),
(3, 'difficulty_level', 'advanced');

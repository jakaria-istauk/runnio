-- Insert Bangladesh-specific sample data
-- Running Events Management System

-- Insert Bangladesh users
INSERT INTO users (name, email, password, role) VALUES 
('Rashid Ahmed', 'rashid@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Fatima Khan', 'fatima@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Karim Rahman', 'karim@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Nasreen Begum', 'nasreen@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Tariq Hassan', 'tariq@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert Bangladesh-specific events
INSERT INTO events (name, description, type, location, distances, event_date, created_by, registration_deadline, submission_deadline) VALUES 
(
    'Dhaka Victory Day Marathon 2024',
    'Celebrate Bangladesh Independence with this patriotic marathon through the heart of Dhaka. Run past historic landmarks and experience the spirit of freedom!',
    'onsite',
    'Suhrawardy Udyan, Dhaka',
    '["5km", "10km", "21km", "42km"]',
    '2024-12-16 06:00:00',
    1,
    '2024-12-01',
    NULL
),
(
    'Cox''s Bazar Beach Run',
    'Experience the world''s longest natural sea beach while running along the pristine coastline of Cox''s Bazar.',
    'onsite',
    'Cox''s Bazar Beach, Chittagong',
    '["5km", "10km", "21km"]',
    '2024-11-25 07:00:00',
    1,
    '2024-11-15',
    NULL
),
(
    'Sundarbans Virtual Challenge',
    'A virtual running challenge inspired by the magnificent Sundarbans mangrove forest. Complete your distance while supporting wildlife conservation.',
    'virtual',
    NULL,
    '["5km", "10km", "15km", "21km"]',
    '2024-10-01 00:00:00',
    1,
    '2024-09-25',
    '2024-10-31'
),
(
    'Chittagong Hill Tracts Trail Run',
    'Adventure through the scenic hills of Chittagong Hill Tracts. Experience the natural beauty and cultural diversity of this unique region.',
    'onsite',
    'Rangamati, Chittagong Hill Tracts',
    '["10km", "21km"]',
    '2024-11-10 08:00:00',
    1,
    '2024-11-01',
    NULL
),
(
    'Sylhet Tea Garden Marathon',
    'Run through the lush green tea gardens of Sylhet. Enjoy the fresh mountain air and stunning landscapes of Bangladesh''s tea country.',
    'onsite',
    'Srimangal Tea Gardens, Sylhet',
    '["5km", "10km", "21km", "42km"]',
    '2024-12-08 07:00:00',
    1,
    '2024-11-25',
    NULL
),
(
    'Rajshahi Mango Festival Run',
    'Celebrate the famous mangoes of Rajshahi with this fun community run during mango season.',
    'onsite',
    'Rajshahi University Campus, Rajshahi',
    '["3km", "5km", "10km"]',
    '2024-06-15 06:30:00',
    1,
    '2024-06-10',
    NULL
),
(
    'Paharpur Heritage Run',
    'Explore the ancient Buddhist monastery ruins of Paharpur, a UNESCO World Heritage Site, while participating in this cultural run.',
    'onsite',
    'Paharpur Archaeological Site, Naogaon',
    '["5km", "10km"]',
    '2024-11-30 07:30:00',
    1,
    '2024-11-20',
    NULL
),
(
    'Bangla New Year Virtual Celebration',
    'Celebrate Pohela Boishakh (Bengali New Year) with this virtual running event. Participants worldwide can join in the festivities!',
    'virtual',
    NULL,
    '["1.4km", "5km", "10km", "14km"]',
    '2024-04-14 00:00:00',
    1,
    '2024-04-10',
    '2024-04-20'
);

-- Insert metadata for Bangladesh events
INSERT INTO event_meta (event_id, meta_key, meta_value) VALUES 
-- Dhaka Victory Day Marathon
(4, 'entry_fee', '800'),
(4, 'entry_fee_currency', 'BDT'),
(4, 'max_participants', '10000'),
(4, 'difficulty_level', 'intermediate'),
(4, 'weather_info', 'Cool winter morning, ideal for running'),
(4, 'parking_available', 'yes'),
(4, 'refreshments', 'Water stations every 2km, traditional snacks at finish'),

-- Cox's Bazar Beach Run
(5, 'entry_fee', '600'),
(5, 'entry_fee_currency', 'BDT'),
(5, 'max_participants', '3000'),
(5, 'difficulty_level', 'beginner'),
(5, 'weather_info', 'Pleasant coastal weather'),
(5, 'special_note', 'Beach terrain - bring appropriate footwear'),

-- Sundarbans Virtual Challenge
(6, 'entry_fee', '300'),
(6, 'entry_fee_currency', 'BDT'),
(6, 'max_participants', 'unlimited'),
(6, 'difficulty_level', 'beginner'),
(6, 'charity_partner', 'Bangladesh Wildlife Conservation Society'),
(6, 'virtual_medal', 'yes'),

-- Chittagong Hill Tracts Trail Run
(7, 'entry_fee', '700'),
(7, 'entry_fee_currency', 'BDT'),
(7, 'max_participants', '800'),
(7, 'difficulty_level', 'advanced'),
(7, 'elevation_gain', '500m'),
(7, 'terrain_type', 'hilly_trail'),

-- Sylhet Tea Garden Marathon
(8, 'entry_fee', '900'),
(8, 'entry_fee_currency', 'BDT'),
(8, 'max_participants', '5000'),
(8, 'difficulty_level', 'intermediate'),
(8, 'scenic_route', 'yes'),
(8, 'local_cuisine', 'Seven-layer tea tasting at finish line'),

-- Rajshahi Mango Festival Run
(9, 'entry_fee', '400'),
(9, 'entry_fee_currency', 'BDT'),
(9, 'max_participants', '2000'),
(9, 'difficulty_level', 'beginner'),
(9, 'family_friendly', 'yes'),
(9, 'festival_activities', 'Mango tasting, cultural programs'),

-- Paharpur Heritage Run
(10, 'entry_fee', '500'),
(10, 'entry_fee_currency', 'BDT'),
(10, 'max_participants', '1000'),
(10, 'difficulty_level', 'beginner'),
(10, 'historical_significance', 'UNESCO World Heritage Site'),
(10, 'guided_tour', 'Optional archaeological site tour after run'),

-- Bangla New Year Virtual Celebration
(11, 'entry_fee', '250'),
(11, 'entry_fee_currency', 'BDT'),
(11, 'max_participants', 'unlimited'),
(11, 'difficulty_level', 'beginner'),
(11, 'cultural_theme', 'Bengali New Year celebration'),
(11, 'virtual_medal', 'yes'),
(11, 'special_distance', '1.4km represents year 1431 in Bengali calendar');

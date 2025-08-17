# 🏃‍♂️ Runnio - Running Events Management System

A comprehensive web application for managing running events, user registrations, and race results. Built with PHP backend and React frontend.

## ✨ Features

### 🌐 Public Features
- Browse all running events without registration
- Filter events by type (Virtual/On-site), location, date, and distance
- Search events by name and description
- View detailed event information including registration counts

### 👤 User Features
- User registration and authentication
- Register for running events with distance selection
- Personal dashboard showing upcoming and past events
- Submit race results (pace, finish time, notes) for completed events
- Track personal running history and achievements

### 👨‍💼 Admin Features
- Complete event management (create, edit, delete)
- View and manage all user registrations
- Comprehensive admin dashboard with statistics
- User and registration oversight
- Event metadata management (entry fees, difficulty levels, participant limits)

## 🚀 Quick Start

### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- Node.js 16+
- npm or yarn

### Setup
1. **Clone and setup database:**
   ```bash
   # Setup database
   mysql -u root -p
   CREATE DATABASE running_events;

   # Run migrations
   php test_backend.php  # Test backend setup
   cd backend && php database/setup.php
   ```

2. **Configure backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   php -S localhost:8000  # Start backend server
   ```

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev  # Start frontend (http://localhost:3000)
   ```

### Demo Accounts
- **Admin:** `admin@runningevents.com` / `admin123`
- **User:** `john@example.com` / `user123`

## 📋 Project Structure

```
running-events/
├── backend/                 # PHP Backend
│   ├── api/                # API endpoints
│   │   ├── auth/          # Authentication
│   │   ├── events/        # Event management
│   │   ├── registrations/ # Registration management
│   │   └── logs/          # Race results
│   ├── config/            # Configuration files
│   ├── database/          # Database migrations
│   └── utils/             # Utility classes
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
└── docs/                  # Documentation
```

## 🛠 Tech Stack

- **Backend:** PHP 7.4+, MySQL, JWT Authentication
- **Frontend:** React 18, Vite, React Router, Axios
- **Styling:** CSS3 with custom styles
- **Authentication:** JWT tokens with role-based access control

---

## 📚 API Documentation

This section describes the database schema, API endpoints, and role-based access permissions.

🗄 Database Schema
1. users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- hashed
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. events
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('virtual', 'onsite') NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    distances VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registration_deadline DATE,
    submission_deadline DATE
);

3. event_meta
CREATE TABLE event_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    meta_key VARCHAR(100),
    meta_value TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

4. registrations
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

5. user_logs
CREATE TABLE user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    pace VARCHAR(50),
    finish_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
);

⚙️ API Endpoints
Authentication
Endpoint	Method	Role	Description
/api/register	POST	All	Register new user
/api/login	POST	All	User login (JWT/session)
Events
Endpoint	Method	Role	Description
/api/events	GET	Public	List all events
/api/events/:id	GET	Public	Get event details
/api/events	POST	Admin	Create event
/api/events/:id	PUT	Admin	Update event
/api/events/:id	DELETE	Admin	Delete event
Registrations
Endpoint	Method	Role	Description
/api/events/:id/register	POST	User	Register for an event
/api/users/:id/registrations	GET	User	Get own registrations
/api/registrations	GET	Admin	Get all registrations
User Logs
Endpoint	Method	Role	Description
/api/registrations/:id/logs	GET	User/Admin	Get logs (own for user, all for admin)
/api/registrations/:id/logs	POST	User/Admin	Add log (own for user, all for admin)
🔒 Role-Based Access Control

Admin

Full control of events (create, edit, delete)

View/manage all registrations

View/manage all logs

User

Browse events

Register for events

Manage only their own registrations & logs

🎨 Frontend Pages

Home Page – Browse all events (public)

Event Details Page – Event info + register

User Dashboard – Own registrations & logs

Admin Dashboard – Manage events, registrations, logs


## 🔐 Security Features

- JWT-based authentication with secure token management
- Role-based access control (Admin/User)
- Password hashing with PHP's password_hash()
- Input validation and sanitization
- CORS protection
- SQL injection prevention with prepared statements

## 🎯 User Experience

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Intuitive Navigation:** Clear menu structure and breadcrumbs
- **Real-time Feedback:** Loading states and error handling
- **Filtering & Search:** Advanced event discovery
- **Dashboard Views:** Personalized user and admin dashboards

## 📊 Event Management

### Event Types
- **Virtual Events:** Run anywhere, submit results online
- **On-site Events:** Physical location-based races

### Event Features
- Multiple distance options per event
- Registration deadlines and participant limits
- Entry fees and difficulty levels
- Flexible metadata system for custom properties
- Registration tracking and management

## 🏃‍♂️ Registration & Results

- **Easy Registration:** Select distance and register with one click
- **Result Submission:** Track pace, finish time, and personal notes
- **History Tracking:** View all past participations and achievements
- **Status Management:** Track registration status (registered/completed/cancelled)

## 🔧 Development

### Backend Architecture
- **RESTful API:** Clean, consistent endpoint structure
- **Modular Design:** Separated concerns with utility classes
- **Database Abstraction:** PDO for secure database operations
- **Error Handling:** Comprehensive error responses

### Frontend Architecture
- **Component-Based:** Reusable React components
- **Context API:** Global state management for authentication
- **Custom Hooks:** Shared logic for API calls and state
- **Responsive Design:** Mobile-first CSS approach

## 📈 Future Enhancements

- Payment integration for event fees
- Email notifications for registrations and deadlines
- Social features (event sharing, participant networking)
- Advanced analytics and reporting
- Mobile app development
- Integration with fitness tracking devices

---

## 🚀 Tech Stack

**Backend:** PHP 7.4+, MySQL, JWT Authentication
**Frontend:** React 18, Vite, React Router, Axios
**Database:** MySQL with optimized indexes
**Authentication:** JWT tokens with role-based access
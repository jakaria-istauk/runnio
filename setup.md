# Running Events Management System - Setup Guide

This guide will help you set up and run the Running Events Management System locally.

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Node.js 16 or higher
- npm or yarn
- A web server (Apache, Nginx, or PHP built-in server)

## Backend Setup

### 1. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE running_events;
```

2. Create a MySQL user (optional but recommended):
```sql
CREATE USER 'running_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON running_events.* TO 'running_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Configuration

1. Copy the environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_NAME=running_events
DB_USER=running_user
DB_PASS=your_password

APP_ENV=development
JWT_SECRET=your-very-secure-secret-key-change-this-in-production
```

### 3. Database Migration

Run the database setup script:
```bash
cd backend
php database/setup.php
```

This will create all necessary tables and insert sample data including:
- Admin user: `admin@runningevents.com` / `admin123`
- Sample users: `john@example.com` / `user123`
- Sample events with different types and distances

### 4. Start Backend Server

Using PHP built-in server:
```bash
cd backend
php -S localhost:8000
```

Or configure your web server to serve the `backend` directory.

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the Application

### 1. Access the Application

Open your browser and go to `http://localhost:3000`

### 2. Test User Accounts

**Admin Account:**
- Email: `admin@runningevents.com`
- Password: `admin123`
- Can create, edit, delete events and view all registrations

**Regular User Account:**
- Email: `john@example.com`
- Password: `user123`
- Can register for events and submit results

### 3. Test Features

1. **Public Access:**
   - Browse events without logging in
   - Filter events by type, location, date
   - Search events by name/description

2. **User Features:**
   - Register for events
   - View personal dashboard
   - Submit race results for completed events

3. **Admin Features:**
   - Create new events
   - Manage existing events
   - View all registrations
   - Delete events (if no registrations exist)

## API Endpoints

The backend provides RESTful API endpoints:

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Events (Public)
- `GET /api/events` - List all events (with filtering)
- `GET /api/events/:id` - Get event details

### Events (Admin only)
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations
- `POST /api/events/:id/register` - Register for event
- `GET /api/users/:id/registrations` - Get user registrations
- `GET /api/registrations` - Get all registrations (admin)

### User Logs
- `GET /api/registrations/:id/logs` - Get registration logs
- `POST /api/registrations/:id/logs` - Submit race results

## Troubleshooting

### Backend Issues

1. **Database Connection Error:**
   - Check your `.env` file configuration
   - Ensure MySQL is running
   - Verify database and user exist

2. **CORS Issues:**
   - Check `ALLOWED_ORIGINS` in config
   - Ensure frontend URL is included

3. **JWT Token Issues:**
   - Check `JWT_SECRET` in `.env`
   - Clear browser localStorage if needed

### Frontend Issues

1. **API Connection Error:**
   - Ensure backend server is running on port 8000
   - Check proxy configuration in `vite.config.js`

2. **Build Issues:**
   - Delete `node_modules` and run `npm install` again
   - Check Node.js version compatibility

## Production Deployment

### Backend
1. Set `APP_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper web server (Apache/Nginx)
4. Enable HTTPS
5. Set up proper database backups

### Frontend
1. Build the production version:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with a web server
3. Update API base URL for production

## Security Notes

- Change default passwords immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs

## Support

For issues or questions, please check the API documentation in `readme.md` or create an issue in the project repository.

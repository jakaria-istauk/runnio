```
██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗██╗ ██████╗
██╔══██╗██║   ██║████╗  ██║████╗  ██║██║██╔═══██╗
██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║██║██║   ██║
██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██║██║   ██║
██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║██║╚██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝ ╚═════╝
```

<div align="center">

# 🏃‍♂️ **Runnio - Running Events Management System**

### *Empowering runners, organizing events, tracking achievements* 🏆

[![PHP](https://img.shields.io/badge/PHP-7.4+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-api-documentation) • [🎯 Features](#-features) • [🛠 Tech Stack](#-tech-stack)

</div>

---

## 📋 **Table of Contents**

- [🎯 Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📊 Demo Accounts](#-demo-accounts)
- [🏗 Project Structure](#-project-structure)
- [🛠 Tech Stack](#-tech-stack)
- [🔐 Security Features](#-security-features)
- [📖 API Documentation](#-api-documentation)
- [🔧 Development](#-development)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 **Features**

<table>
<tr>
<td width="33%">

### 🌐 **Public Access**
- 🔍 Browse events without registration
- 🎛️ Advanced filtering & search
- 📱 Responsive design
- 📊 Real-time event statistics

</td>
<td width="33%">

### 👤 **User Portal**
- 🔐 Secure authentication
- 📝 Easy event registration
- 📈 Personal dashboard
- 🏃‍♂️ Results tracking

</td>
<td width="33%">

### 👨‍💼 **Admin Control**
- ⚙️ Complete event management
- 👥 User oversight
- 📊 Analytics dashboard
- 🎛️ System configuration

</td>
</tr>
</table>

### 🌟 **Key Capabilities**

| Feature | Description | User Type |
|---------|-------------|-----------|
| 🏃‍♂️ **Event Discovery** | Browse and filter running events by type, location, date, and distance | Public |
| 📝 **Quick Registration** | One-click event registration with distance selection | Users |
| 📊 **Results Tracking** | Submit and track race results with pace, time, and notes | Users |
| 🎛️ **Event Management** | Create, edit, and manage events with flexible metadata | Admins |
| 👥 **User Oversight** | Monitor registrations and manage user accounts | Admins |
| 📈 **Analytics** | Comprehensive dashboards with statistics and insights | Admins |

---

## 🚀 **Quick Start**

### 📋 **Prerequisites**

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| 🐘 **PHP** | 7.4+ | [Download PHP](https://php.net/downloads) |
| 🗄️ **MySQL** | 5.7+ | [Download MySQL](https://dev.mysql.com/downloads/) |
| 🟢 **Node.js** | 16+ | [Download Node.js](https://nodejs.org/) |
| 📦 **npm/yarn** | Latest | Included with Node.js |

### ⚡ **Installation**

<details>
<summary><b>🗄️ Step 1: Database Setup</b></summary>

```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE running_events;
CREATE USER 'running_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON running_events.* TO 'running_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 2. Test backend setup
php test_backend.php

# 3. Run database migrations
cd backend && php database/setup.php
```

</details>

<details>
<summary><b>⚙️ Step 2: Backend Configuration</b></summary>

```bash
# 1. Navigate to backend directory
cd backend

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your credentials
nano .env  # or use your preferred editor

# 4. Start backend server
php -S localhost:8000
```

**Environment Configuration:**
```env
DB_HOST=localhost
DB_NAME=runnio
DB_USER=runnio_user
DB_PASS=your_password
JWT_SECRET=your-very-secure-secret-key
```

</details>

<details>
<summary><b>🎨 Step 3: Frontend Setup</b></summary>

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Frontend will be available at http://localhost:3000
```

</details>

### 🎯 **Verification**

After setup, verify everything works:

1. ✅ **Backend API**: Visit `http://localhost:8000/api/events`
2. ✅ **Frontend**: Visit `http://localhost:3000`
3. ✅ **Login**: Use demo accounts below

---

## 📊 **Demo Accounts**

<div align="center">

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| 👨‍💼 **Admin** | `admin@runnio.com` | `admin123` | Full system access |
| 👤 **User** | `john@example.com` | `user123` | Event registration & results |

</div>

> 🔒 **Security Note**: Change these credentials in production!

---

## 🏗 **Project Structure**

```
🏃‍♂️ runnio/
├── 📁 backend/                    # 🐘 PHP Backend API
│   ├── 📁 api/                   # 🔌 RESTful Endpoints
│   │   ├── 📁 auth/             # 🔐 Authentication (login/register)
│   │   ├── 📁 events/           # 🏃‍♂️ Event management (CRUD)
│   │   ├── 📁 registrations/    # 📝 Registration handling
│   │   └── 📁 logs/             # 📊 Race results & logs
│   ├── 📁 config/               # ⚙️ Configuration files
│   ├── 📁 database/             # 🗄️ Migrations & setup
│   │   └── 📁 migrations/       # 📋 SQL migration files
│   └── 📁 utils/                # 🛠️ Utility classes (JWT, Auth, etc.)
├── 📁 frontend/                   # ⚛️ React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/       # 🧩 Reusable UI components
│   │   ├── 📁 contexts/         # 🌐 React contexts (Auth)
│   │   ├── 📁 pages/            # 📄 Page components
│   │   └── 📁 utils/            # 🔧 Helper functions
│   ├── 📄 package.json          # 📦 Dependencies
│   └── 📄 vite.config.js        # ⚡ Vite configuration
├── 📄 readme.md                  # 📖 This file
├── 📄 setup.md                   # 🚀 Detailed setup guide
└── 📄 test_backend.php           # 🧪 Backend testing script
```

---

## 🛠 **Tech Stack**

<div align="center">

### 🔧 **Backend Technologies**
[![PHP](https://img.shields.io/badge/PHP-7.4+-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

### 🎨 **Frontend Technologies**
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com)

### 🎯 **Key Features**
[![Responsive](https://img.shields.io/badge/Design-Responsive-green?style=flat-square)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
[![REST API](https://img.shields.io/badge/API-RESTful-blue?style=flat-square)](https://restfulapi.net)
[![Security](https://img.shields.io/badge/Security-JWT_+_RBAC-red?style=flat-square)](https://auth0.com/intro-to-iam/what-is-role-based-access-control-rbac)

</div>

| Component | Technology | Purpose |
|-----------|------------|---------|
| 🗄️ **Database** | MySQL 5.7+ | Data persistence with optimized indexes |
| 🔙 **Backend** | PHP 7.4+ | RESTful API with JWT authentication |
| 🎨 **Frontend** | React 18 | Modern SPA with hooks and context |
| 🔧 **Build Tool** | Vite | Fast development and optimized builds |
| 🔐 **Authentication** | JWT + RBAC | Secure token-based auth with roles |
| 🎨 **Styling** | Custom CSS3 | Responsive design with modern layouts |

---

## 📖 **API Documentation**

<div align="center">

### 🔌 **RESTful API Endpoints**

*Complete API reference for developers and integrators*

</div>

<details>
<summary><b>🔐 Authentication Endpoints</b></summary>

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/register` | User registration | Public |
| `POST` | `/api/login` | User authentication | Public |

**Example Request:**
```json
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

</details>

<details>
<summary><b>🏃‍♂️ Events Endpoints</b></summary>

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/events` | List all events | Public |
| `GET` | `/api/events/:id` | Get event details | Public |
| `POST` | `/api/events` | Create new event | Admin |
| `PUT` | `/api/events/:id` | Update event | Admin |
| `DELETE` | `/api/events/:id` | Delete event | Admin |

**Query Parameters for GET /api/events:**
- `type`: Filter by event type (virtual/onsite)
- `location`: Filter by location
- `search`: Search in name/description
- `date_from`: Filter events from date
- `date_to`: Filter events to date
- `page`: Pagination page number
- `limit`: Results per page

</details>

<details>
<summary><b>📝 Registration Endpoints</b></summary>

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/events/:id/register` | Register for event | User |
| `GET` | `/api/users/:id/registrations` | Get user registrations | User/Admin |
| `GET` | `/api/registrations` | Get all registrations | Admin |

</details>

<details>
<summary><b>📊 User Logs Endpoints</b></summary>

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/registrations/:id/logs` | Get registration logs | User/Admin |
| `POST` | `/api/registrations/:id/logs` | Submit race results | User/Admin |

</details>

### 🗄️ **Database Schema**

<div align="center">

*Optimized relational database design with proper indexing and foreign key constraints*

</div>

<details>
<summary><b>👥 Users Table</b></summary>

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashed with bcrypt
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Purpose**: User authentication and role management
**Key Features**: Secure password hashing, role-based access control

</details>

<details>
<summary><b>🏃‍♂️ Events Table</b></summary>

```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('virtual', 'onsite') NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    distances VARCHAR(255),  -- JSON array of available distances
    event_date DATETIME NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    registration_deadline DATE,
    submission_deadline DATE,  -- For virtual events only
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_registration_deadline ON events(registration_deadline);
CREATE INDEX idx_events_created_by ON events(created_by);
```

**Purpose**: Core event information and scheduling
**Key Features**: Flexible distance options, deadline management, creator tracking

</details>

<details>
<summary><b>🏷️ Event Meta Table</b></summary>

```sql
CREATE TABLE event_meta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    meta_key VARCHAR(100) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_event_meta_event_id ON event_meta(event_id);
CREATE INDEX idx_event_meta_key ON event_meta(meta_key);
CREATE INDEX idx_event_meta_event_key ON event_meta(event_id, meta_key);
```

**Purpose**: Flexible event metadata (WordPress-style)
**Key Features**: Entry fees, difficulty levels, participant limits, custom properties

</details>

<details>
<summary><b>📝 Registrations Table</b></summary>

```sql
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    distance VARCHAR(50),  -- Selected distance for this registration
    status ENUM('registered', 'completed', 'cancelled') DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id)  -- Prevent duplicate registrations
);

-- Indexes for performance
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);
```

**Purpose**: User-event relationship management
**Key Features**: Distance selection, status tracking, duplicate prevention

</details>

<details>
<summary><b>📊 User Logs Table</b></summary>

```sql
CREATE TABLE user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL,
    pace VARCHAR(50),  -- e.g., "5:30 min/km"
    finish_time VARCHAR(50),  -- e.g., "1:45:30"
    distance_completed VARCHAR(50),  -- Actual distance completed
    notes TEXT,  -- Additional notes from user
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_user_logs_registration_id ON user_logs(registration_id);
CREATE INDEX idx_user_logs_submitted_at ON user_logs(submitted_at);
```

**Purpose**: Race results and performance tracking
**Key Features**: Pace calculation, completion tracking, personal notes

</details>

### ⚙️ **API Endpoints Reference**

<div align="center">

*Complete RESTful API documentation with authentication and role-based access*

</div>

#### 🔐 **Authentication Endpoints**

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `POST` | `/api/register` | Register new user account | 🌐 Public | `name`, `email`, `password` |
| `POST` | `/api/login` | User authentication & JWT token | 🌐 Public | `email`, `password` |

**Example Authentication Request:**
```json
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Example Authentication Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Runner",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

#### 🏃‍♂️ **Events Management Endpoints**

| Method | Endpoint | Description | Access Level | Query Parameters |
|--------|----------|-------------|--------------|------------------|
| `GET` | `/api/events` | List all events with filtering | 🌐 Public | `type`, `location`, `search`, `date_from`, `date_to`, `page`, `limit` |
| `GET` | `/api/events/:id` | Get detailed event information | 🌐 Public | - |
| `POST` | `/api/events` | Create new running event | 👨‍💼 Admin Only | Event data object |
| `PUT` | `/api/events/:id` | Update existing event | 👨‍💼 Admin Only | Updated event data |
| `DELETE` | `/api/events/:id` | Delete event (if no registrations) | 👨‍💼 Admin Only | - |

**Example Event Creation Request:**
```json
POST /api/events
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "City Marathon 2024",
  "description": "Annual city marathon with multiple distances",
  "type": "onsite",
  "location": "Central Park, New York",
  "distances": ["5km", "10km", "21km", "42km"],
  "event_date": "2024-09-15T08:00:00",
  "registration_deadline": "2024-09-01",
  "metadata": {
    "entry_fee": "50",
    "max_participants": "5000",
    "difficulty_level": "intermediate"
  }
}
```

#### 📝 **Registration Management Endpoints**

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `POST` | `/api/events/:id/register` | Register user for specific event | 👤 User | `distance` |
| `GET` | `/api/users/:id/registrations` | Get user's event registrations | 👤 User/👨‍💼 Admin | - |
| `GET` | `/api/registrations` | Get all system registrations | 👨‍💼 Admin Only | `event_id`, `status`, `search`, `page`, `limit` |

**Example Registration Request:**
```json
POST /api/events/1/register
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "distance": "10km"
}
```

#### 📊 **User Logs & Results Endpoints**

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `GET` | `/api/registrations/:id/logs` | Get race results for registration | 👤 User/👨‍💼 Admin | - |
| `POST` | `/api/registrations/:id/logs` | Submit race results & performance | 👤 User/👨‍💼 Admin | `finish_time`, `pace`, `distance_completed`, `notes` |

**Example Results Submission:**
```json
POST /api/registrations/1/logs
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "finish_time": "1:45:30",
  "pace": "5:30",
  "distance_completed": "10km",
  "notes": "Great race! Perfect weather conditions."
}
```
### 🔒 **Role-Based Access Control**

<div align="center">

*Comprehensive permission system ensuring secure and appropriate access levels*

</div>

<table>
<tr>
<td width="50%">

#### 👨‍💼 **Admin Privileges**

- ✅ **Event Management**
  - Create new running events
  - Edit existing event details
  - Delete events (if no registrations)
  - Manage event metadata & settings

- ✅ **User Oversight**
  - View all user registrations
  - Monitor registration statistics
  - Access user performance logs
  - Manage user accounts

- ✅ **System Administration**
  - Access comprehensive analytics
  - Export registration data
  - Configure system settings
  - Monitor platform health

</td>
<td width="50%">

#### 👤 **User Privileges**

- ✅ **Event Participation**
  - Browse all public events
  - Register for upcoming events
  - Select preferred distances
  - Cancel own registrations

- ✅ **Personal Management**
  - View personal dashboard
  - Track registration history
  - Submit race results & logs
  - Update personal information

- ✅ **Performance Tracking**
  - Record finish times & pace
  - Add race notes & experiences
  - View personal statistics
  - Track improvement over time

</td>
</tr>
</table>

### 🎨 **Frontend Application Structure**

<div align="center">

*Modern React SPA with intuitive navigation and responsive design*

</div>

| Page | Route | Access Level | Key Features |
|------|-------|--------------|--------------|
| 🏠 **Home Page** | `/` | 🌐 Public | Event browsing, filtering, search functionality |
| 🏃‍♂️ **Event Details** | `/events/:id` | 🌐 Public | Detailed event info, registration interface |
| 🔐 **Login** | `/login` | 🌐 Public | User authentication, demo account access |
| 📝 **Register** | `/register` | � Public | New user account creation |
| 📊 **User Dashboard** | `/dashboard` | 👤 User | Personal registrations, results submission |
| ⚙️ **Admin Panel** | `/admin` | 👨‍💼 Admin | Event management, user oversight, analytics |

#### 🎯 **Page Features Overview**

<details>
<summary><b>🏠 Home Page Features</b></summary>

- **Event Discovery**: Browse all available running events
- **Advanced Filtering**: Filter by type, location, date, distance
- **Real-time Search**: Search events by name and description
- **Responsive Cards**: Mobile-friendly event display
- **Pagination**: Efficient loading of large event lists
- **Registration Status**: Visual indicators for open/closed registration

</details>

<details>
<summary><b>🏃‍♂️ Event Details Features</b></summary>

- **Comprehensive Info**: Full event details and metadata
- **Registration Interface**: One-click registration with distance selection
- **Participant Count**: Real-time registration statistics
- **Location Maps**: Integration-ready location display
- **Deadline Tracking**: Visual countdown to registration deadlines
- **Social Sharing**: Share events with the running community

</details>

<details>
<summary><b>📊 Dashboard Features</b></summary>

- **Personal Statistics**: Registration counts and achievements
- **Event Timeline**: Upcoming and past event organization
- **Results Submission**: Easy race result logging interface
- **Performance Tracking**: Historical data and progress visualization
- **Quick Actions**: Fast access to common tasks
- **Responsive Design**: Optimized for all device sizes

</details>


---

## 🔐 **Security Features**

<div align="center">

| 🛡️ Security Layer | Implementation | Benefit |
|-------------------|----------------|---------|
| 🔑 **Authentication** | JWT tokens with expiration | Stateless, secure sessions |
| 👥 **Authorization** | Role-based access control | Granular permissions |
| 🔒 **Password Security** | PHP password_hash() + salt | Industry-standard hashing |
| 🛡️ **Input Validation** | Server-side sanitization | Prevents XSS/injection |
| 🌐 **CORS Protection** | Configured origins | Prevents unauthorized access |
| 🗄️ **SQL Security** | Prepared statements | Prevents SQL injection |

</div>

### 🔒 **Security Checklist**

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Role-Based Access**: Admin/User permission levels
- ✅ **Password Hashing**: Bcrypt with salt for password security
- ✅ **Input Sanitization**: All user inputs validated and sanitized
- ✅ **CORS Configuration**: Restricted cross-origin requests
- ✅ **SQL Injection Prevention**: Prepared statements throughout
- ✅ **XSS Protection**: Output escaping and CSP headers
- ✅ **Environment Variables**: Sensitive data in .env files

---

## 🎯 **User Experience**

<table>
<tr>
<td width="50%">

### 📱 **Responsive Design**
- 🖥️ Desktop optimized layouts
- 📱 Mobile-first approach
- 📊 Adaptive components
- 🎨 Consistent styling

</td>
<td width="50%">

### ⚡ **Performance**
- 🚀 Fast loading times
- 📦 Optimized bundles
- 🔄 Efficient API calls
- 💾 Smart caching

</td>
</tr>
<tr>
<td width="50%">

### 🧭 **Navigation**
- 🎯 Intuitive menu structure
- 🍞 Breadcrumb navigation
- 🔍 Advanced search & filters
- 📊 Real-time feedback

</td>
<td width="50%">

### 🎛️ **Dashboards**
- 👤 Personalized user views
- 👨‍💼 Comprehensive admin panel
- 📈 Statistics and analytics
- 🎨 Clean, modern interface

</td>
</tr>
</table>

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

---

## 🔧 **Development**

### 🏗️ **Backend Architecture**

```mermaid
graph TD
    A[Client Request] --> B[index.php Router]
    B --> C{Authentication Required?}
    C -->|Yes| D[JWT Validation]
    C -->|No| E[Public Endpoint]
    D --> F[Role Check]
    F --> G[API Endpoint]
    E --> G
    G --> H[Database Layer]
    H --> I[Response]
```

### ⚛️ **Frontend Architecture**

- **Component-Based**: Modular, reusable React components
- **Context API**: Global state management for authentication
- **Custom Hooks**: Shared logic for API calls and state management
- **Responsive Design**: Mobile-first CSS approach with flexbox/grid

### 🗄️ **Database Schema**

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `users` | User accounts & authentication | → `registrations`, `events` |
| `events` | Event information & metadata | → `registrations`, `event_meta` |
| `event_meta` | Flexible event properties | ← `events` |
| `registrations` | User-event relationships | ← `users`, `events` → `user_logs` |
| `user_logs` | Race results & performance | ← `registrations` |

---

## 🐛 **Troubleshooting**

<details>
<summary><b>🔧 Common Backend Issues</b></summary>

### Database Connection Errors
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1"

# Verify .env configuration
cat backend/.env
```

### CORS Issues
```php
// Add to backend/config/config.php
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://your-domain.com'
]);
```

### JWT Token Problems
```bash
# Clear browser storage
localStorage.clear()

# Check JWT secret in .env
grep JWT_SECRET backend/.env
```

</details>

<details>
<summary><b>🎨 Common Frontend Issues</b></summary>

### API Connection Errors
```bash
# Check backend server
curl http://localhost:8000/api/events

# Verify proxy in vite.config.js
cat frontend/vite.config.js
```

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

### Development Server Issues
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Restart servers
npm run dev
```

</details>

<details>
<summary><b>🔍 Debug Mode</b></summary>

### Enable Debug Logging
```php
// In backend/.env
APP_ENV=development

// Check logs
tail -f /var/log/apache2/error.log
```

### Browser Developer Tools
- **Network Tab**: Check API requests/responses
- **Console**: Look for JavaScript errors
- **Application Tab**: Inspect localStorage/sessionStorage

</details>

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

### 🚀 **Getting Started**

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/runnio.git
   cd runnio
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test your changes**
   ```bash
   php test_backend.php
   cd frontend && npm test
   ```

5. **Submit a pull request**

### 📋 **Development Guidelines**

- **Code Style**: Follow PSR-12 for PHP, ESLint for JavaScript
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update README and inline docs

### 🐛 **Reporting Issues**

Found a bug? Please include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (PHP/Node versions)
- Error messages/logs

---

## 📈 **Roadmap**

### 🎯 **Upcoming Features**

- [ ] 💳 **Payment Integration** - Stripe/PayPal for event fees
- [ ] 📧 **Email Notifications** - Registration confirmations & reminders
- [ ] 📱 **Mobile App** - React Native companion app
- [ ] 🏆 **Leaderboards** - Performance rankings and achievements
- [ ] 📊 **Advanced Analytics** - Detailed reporting and insights
- [ ] 🌐 **Multi-language** - Internationalization support
- [ ] 🔗 **Social Features** - Event sharing and participant networking
- [ ] ⌚ **Wearable Integration** - Sync with fitness trackers

### 🎨 **UI/UX Improvements**

- [ ] 🌙 **Dark Mode** - Theme switching capability
- [ ] 🎨 **Custom Themes** - Brandable color schemes
- [ ] 📱 **PWA Support** - Progressive Web App features
- [ ] ♿ **Accessibility** - WCAG 2.1 compliance

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Runnio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 **Support & Contact**

<div align="center">

### 🤝 **Get Help**

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/yourusername/runnio/issues)
[![Documentation](https://img.shields.io/badge/Docs-Setup_Guide-blue?style=for-the-badge&logo=gitbook)](setup.md)
[![Discord](https://img.shields.io/badge/Discord-Community-7289da?style=for-the-badge&logo=discord)](https://discord.gg/runnio)

### 💬 **Community**

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/runnio/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/runnio/discussions)
- 📖 **Documentation**: [Setup Guide](setup.md)
- 💬 **Chat**: [Discord Community](https://discord.gg/runnio)

</div>

---

<div align="center">

### 🏃‍♂️ **Made with ❤️ for the Running Community**

**Star ⭐ this repo if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/runnio?style=social)](https://github.com/yourusername/runnio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/runnio?style=social)](https://github.com/yourusername/runnio/network)

*Happy Running! 🏃‍♀️🏃‍♂️*

</div>
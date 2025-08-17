<?php
/**
 * Web UI Landing Page
 * Running Events Management System
 */

// Set content type to HTML
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo APP_NAME; ?> - Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .card h3 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .card p {
            color: #666;
            margin-bottom: 1.5rem;
        }
        
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .api-info {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .api-info h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
        }
        
        .endpoint code {
            background: #e9ecef;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .status.healthy {
            background: #d4edda;
            color: #155724;
        }
        
        .footer {
            text-align: center;
            color: white;
            opacity: 0.8;
            margin-top: 3rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .dashboard {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><?php echo APP_NAME; ?></h1>
            <p>Version <?php echo APP_VERSION; ?> • Environment: <?php echo ucfirst(APP_ENV); ?></p>
            <span class="status healthy">System Healthy</span>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h3>🏃‍♂️ Events Management</h3>
                <p>Manage running events, registrations, and participant tracking.</p>
                <a href="/api/events" class="btn">View Events API</a>
            </div>
            
            <div class="card">
                <h3>👥 User Authentication</h3>
                <p>Secure user registration and login system with JWT tokens.</p>
                <a href="/api/health" class="btn">Check Health</a>
            </div>
            
            <div class="card">
                <h3>📊 Registration Tracking</h3>
                <p>Track participant registrations and manage event logs.</p>
                <a href="/api/registrations" class="btn">View Registrations</a>
            </div>
        </div>
        
        <div class="api-info">
            <h3>🔗 Available API Endpoints</h3>
            
            <div class="endpoint">
                <strong>Health Check</strong><br>
                <code>GET /api/health</code> - System health and status information
            </div>
            
            <div class="endpoint">
                <strong>Authentication</strong><br>
                <code>POST /api/register</code> - User registration<br>
                <code>POST /api/login</code> - User login
            </div>
            
            <div class="endpoint">
                <strong>Events</strong><br>
                <code>GET /api/events</code> - List all events<br>
                <code>GET /api/events/{id}</code> - Get specific event<br>
                <code>POST /api/events</code> - Create new event<br>
                <code>PUT /api/events/{id}</code> - Update event<br>
                <code>DELETE /api/events/{id}</code> - Delete event
            </div>
            
            <div class="endpoint">
                <strong>Registrations</strong><br>
                <code>POST /api/events/{id}/register</code> - Register for event<br>
                <code>GET /api/users/{id}/registrations</code> - User registrations<br>
                <code>GET /api/registrations</code> - List all registrations
            </div>
            
            <div class="endpoint">
                <strong>Logs</strong><br>
                <code>GET /api/registrations/{id}/logs</code> - Get registration logs<br>
                <code>POST /api/registrations/{id}/logs</code> - Create log entry
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; <?php echo date('Y'); ?> <?php echo APP_NAME; ?>. Built with PHP.</p>
        </div>
    </div>
</body>
</html>

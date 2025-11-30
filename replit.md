# Moze SMS Sender

## Overview
A Flask-based web application that provides a user-friendly interface for sending SMS messages via the Moze SMS API. The application features a clean, modern frontend with form validation and real-time feedback.

## Project Type
Full-stack web application with:
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (served by Flask)
- **API Integration**: Moze SMS API

## Recent Changes
- **2025-11-30**: Initial Replit setup
  - Installed Python 3.11 and dependencies
  - Configured Flask workflow on port 5000 with webview output
  - Added gunicorn for production deployment
  - Cleaned up duplicate entries in requirements.txt
  - Added comprehensive .gitignore for Python projects
  - Configured deployment settings for autoscale deployment

## Project Architecture

### File Structure
```
.
├── app.py                 # Main Flask application with API endpoints
├── templates/
│   └── index.html        # Frontend SMS sending form
├── requirements.txt      # Python dependencies
├── test_api.py          # API authentication tests
├── test_send_sms.py     # SMS functionality tests
├── attached_assets/     # Image assets
└── .gitignore          # Git ignore patterns
```

### Core Functionality

#### Backend (app.py)
- **`/`**: Serves the main SMS sending page
- **`/api/test-connection`**: Tests connection to Moze SMS API with provided bearer token
- **`/api/send-sms`**: Sends SMS messages through Moze API
- **`/api/health`**: Health check endpoint

#### Frontend (index.html)
- Clean, modern interface with purple gradient design
- Form fields for:
  - Bearer token (password field for security)
  - Sender ID (optional, defaults to "APP")
  - Phone number
  - Message (max 160 characters with live counter)
- Two action buttons:
  - Test Connection: Validates API token
  - Send SMS: Sends the message
- Real-time feedback with success/error alerts
- Character counter for SMS messages

### Dependencies
- **flask==3.0.0**: Web framework
- **requests==2.31.0**: HTTP library for API calls
- **python-dotenv==1.0.0**: Environment variable management
- **pytest==7.4.0**: Testing framework
- **gunicorn==21.2.0**: Production WSGI server

### API Integration
The application integrates with the Moze SMS API:
- **Base URL**: https://api.mozesms.com/v1/sms/bulk
- **Authentication**: Bearer token (obtained from Moze SMS documentation)
- **Supported features**: Bulk SMS sending with sender ID customization

## Development

### Running Locally
The application is configured to run automatically via the "SMS Server" workflow:
- Server: Flask development server
- Host: 0.0.0.0 (accessible from Replit preview)
- Port: 5000
- Debug mode: Enabled in development

### Deployment
Configured for autoscale deployment with:
- Production server: Gunicorn
- Binding: 0.0.0.0:5000
- Port reuse enabled for better performance

### Testing
Two test files are included:
1. **test_api.py**: Tests Moze SMS API login endpoint
2. **test_send_sms.py**: Tests the Flask application endpoints

Run tests with: `pytest test_send_sms.py -v -s`

## User Preferences
- Portuguese language interface (Brazilian Portuguese)
- Clean, modern design with gradient backgrounds
- Mobile-responsive layout
- Real-time form validation and feedback

## Notes
- The application requires a valid Moze SMS API bearer token to function
- SMS messages are limited to 160 characters
- Phone numbers should be in international format (e.g., +55 11 9 9999-9999)
- The development server shows a warning about not using it in production - this is normal and gunicorn is configured for production deployment

from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime
import os

app = Flask(__name__)

# Moze SMS API Configuration
MOZE_SMS_API_BASE = "https://my.mozesms.com"
MOZE_SMS_LOGIN_URL = f"{MOZE_SMS_API_BASE}/login"
MOZE_SMS_SEND_URL = f"{MOZE_SMS_API_BASE}/send"  # Adjust based on actual API

# Store session token after login
session_token = None

@app.route('/')
def index():
    """Serve the SMS sending page"""
    return render_template('index.html')

@app.route('/api/test-connection', methods=['POST'])
def test_connection():
    """Test connection to Moze SMS API"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'error': 'Username and password required'}), 400
        
        # Test login endpoint
        response = requests.post(
            MOZE_SMS_LOGIN_URL,
            json={'username': username, 'password': password},
            timeout=10,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code in [200, 302]:
            return jsonify({
                'success': True,
                'message': 'Connection successful!',
                'status': response.status_code
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': f'Login failed with status {response.status_code}'
            }), response.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Connection timeout'}), 408
    except requests.exceptions.ConnectionError:
        return jsonify({'success': False, 'error': 'Could not connect to Moze SMS API'}), 503
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/send-sms', methods=['POST'])
def send_sms():
    """Send SMS using Moze API"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        phone = data.get('phone')
        message = data.get('message')
        
        # Validate inputs
        if not all([username, password, phone, message]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        if len(phone) < 10:
            return jsonify({'success': False, 'error': 'Invalid phone number'}), 400
        
        if len(message) > 160:
            return jsonify({'success': False, 'error': 'Message exceeds 160 characters'}), 400
        
        # Login first to get session
        login_response = requests.post(
            MOZE_SMS_LOGIN_URL,
            json={'username': username, 'password': password},
            timeout=10,
            headers={'Content-Type': 'application/json'}
        )
        
        if login_response.status_code not in [200, 302]:
            return jsonify({'success': False, 'error': 'Authentication failed'}), 401
        
        # Prepare SMS payload (adjust based on Moze API documentation)
        sms_payload = {
            'to': phone,
            'message': message,
            'from': 'APP'  # Adjust sender ID as needed
        }
        
        # Send SMS
        send_response = requests.post(
            MOZE_SMS_SEND_URL,
            json=sms_payload,
            timeout=10,
            headers={
                'Content-Type': 'application/json',
                'Cookie': login_response.headers.get('Set-Cookie', '')
            }
        )
        
        return jsonify({
            'success': send_response.status_code in [200, 201],
            'message': 'SMS sent successfully!' if send_response.status_code in [200, 201] else 'Failed to send SMS',
            'status': send_response.status_code,
            'timestamp': datetime.now().isoformat()
        }), send_response.status_code
        
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Connection timeout'}), 408
    except requests.exceptions.ConnectionError:
        return jsonify({'success': False, 'error': 'Could not connect to Moze SMS API'}), 503
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'Moze SMS Sender'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

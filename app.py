from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

# Moze SMS API Configuration
MOZE_SMS_API_BASE = "https://api.mozesms.com/v1/sms/bulk"

@app.route('/')
def index():
    """Serve the SMS sending page"""
    return render_template('index.html')

@app.route('/api/test-connection', methods=['POST'])
def test_connection():
    """Test connection to Moze SMS API"""
    try:
        data = request.json
        bearer_token = data.get('bearer_token')
        
        if not bearer_token:
            return jsonify({'success': False, 'error': 'Bearer token é obrigatório'}), 400
        
        # Test with a simple request
        headers = {
            'Authorization': f'Bearer {bearer_token}',
            'Content-Type': 'application/json'
        }
        
        test_payload = {
            'from': 'TEST',
            'messages': [
                {
                    'to': '5511000000000',
                    'text': 'Teste de conexão'
                }
            ]
        }
        
        response = requests.post(
            MOZE_SMS_API_BASE,
            json=test_payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            return jsonify({
                'success': True,
                'message': 'Conexão bem-sucedida!',
                'status': response.status_code
            }), 200
        elif response.status_code == 401:
            return jsonify({
                'success': False,
                'error': 'Token de autenticação inválido'
            }), 401
        else:
            return jsonify({
                'success': False,
                'error': f'Erro na API: {response.status_code}',
                'details': response.text
            }), response.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Timeout na conexão'}), 408
    except requests.exceptions.ConnectionError:
        return jsonify({'success': False, 'error': 'Não foi possível conectar à API Moze'}), 503
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/send-sms', methods=['POST'])
def send_sms():
    """Send SMS using Moze API"""
    try:
        data = request.json
        bearer_token = data.get('bearer_token')
        phone = data.get('phone')
        message = data.get('message')
        sender_id = data.get('sender_id', 'APP')
        
        # Validate inputs
        if not all([bearer_token, phone, message]):
            return jsonify({'success': False, 'error': 'Campos obrigatórios faltando'}), 400
        
        if len(phone) < 10:
            return jsonify({'success': False, 'error': 'Número de telefone inválido'}), 400
        
        if len(message) > 160:
            return jsonify({'success': False, 'error': 'Mensagem exceeds 160 caracteres'}), 400
        
        # Prepare headers with Bearer token
        headers = {
            'Authorization': f'Bearer {bearer_token}',
            'Content-Type': 'application/json'
        }
        
        # Prepare SMS payload according to Moze API format
        sms_payload = {
            'from': sender_id,
            'messages': [
                {
                    'to': phone,
                    'text': message
                }
            ]
        }
        
        # Send SMS
        response = requests.post(
            MOZE_SMS_API_BASE,
            json=sms_payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            return jsonify({
                'success': True,
                'message': 'SMS enviado com sucesso!',
                'status': response.status_code,
                'timestamp': datetime.now().isoformat()
            }), 200
        elif response.status_code == 401:
            return jsonify({
                'success': False,
                'error': 'Token de autenticação inválido'
            }), 401
        else:
            return jsonify({
                'success': False,
                'error': f'Erro ao enviar: {response.status_code}',
                'details': response.text
            }), response.status_code
        
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Timeout na conexão'}), 408
    except requests.exceptions.ConnectionError:
        return jsonify({'success': False, 'error': 'Não foi possível conectar à API Moze'}), 503
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'Moze SMS Sender'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

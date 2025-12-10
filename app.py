from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='static', static_url_path='/static')

@app.route('/')
def index():
    """Serve the roulette wheel game"""
    return send_from_directory('static', 'index.html')

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    from flask import jsonify
    return jsonify({'status': 'ok', 'service': 'Roleta da Sorte'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

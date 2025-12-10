from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    """Serve the roulette game page"""
    return send_from_directory('static', 'index.html')

@app.route('/roleta')
def roleta():
    """Serve the roulette game page"""
    return send_from_directory('static', 'index.html')

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {'status': 'ok', 'service': 'Free Bet Roleta'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
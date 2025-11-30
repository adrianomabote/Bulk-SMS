import requests
import pytest

BASE_URL = "http://localhost:5000"

class TestMozeSMSIntegration:
    """Tests for Moze SMS sending functionality"""
    
    def test_health_check(self):
        """Test that the API is running"""
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'ok'
        print("✓ Health check passed")
    
    def test_index_page_loads(self):
        """Test that the SMS form page loads"""
        response = requests.get(f"{BASE_URL}/", timeout=5)
        assert response.status_code == 200
        assert 'Moze SMS' in response.text
        print("✓ Index page loads successfully")
    
    def test_test_connection_missing_token(self):
        """Test connection endpoint with missing token"""
        response = requests.post(
            f"{BASE_URL}/api/test-connection",
            json={},
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        print("✓ Missing token validation works")
    
    def test_send_sms_missing_fields(self):
        """Test send SMS with missing fields"""
        response = requests.post(
            f"{BASE_URL}/api/send-sms",
            json={"bearer_token": "test"},
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        print("✓ Missing fields validation works")
    
    def test_send_sms_invalid_phone(self):
        """Test send SMS with invalid phone number"""
        response = requests.post(
            f"{BASE_URL}/api/send-sms",
            json={
                "bearer_token": "test_token",
                "phone": "123",
                "message": "test"
            },
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        assert 'Invalid' in data['error'] or 'inválido' in data['error']
        print("✓ Invalid phone validation works")
    
    def test_send_sms_message_too_long(self):
        """Test send SMS with message exceeding 160 characters"""
        long_message = "x" * 161
        response = requests.post(
            f"{BASE_URL}/api/send-sms",
            json={
                "bearer_token": "test_token",
                "phone": "5511999999999",
                "message": long_message
            },
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        assert '160' in data['error']
        print("✓ Message length validation works")

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])

import requests
import pytest
import json

BASE_URL = "http://localhost:5000"
TEST_CREDENTIALS = {
    "username": "seu_usuario",
    "password": "sua_senha"
}

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
    
    def test_test_connection_missing_credentials(self):
        """Test connection endpoint with missing credentials"""
        response = requests.post(
            f"{BASE_URL}/api/test-connection",
            json={},
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        print("✓ Missing credentials validation works")
    
    def test_test_connection_invalid_credentials(self):
        """Test connection endpoint with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/test-connection",
            json={
                "username": "invalid_user",
                "password": "invalid_pass"
            },
            timeout=10
        )
        # Should fail or not return 200
        print(f"Response status: {response.status_code}")
        print(f"Response: {response.json()}")
        print("✓ Invalid credentials test completed")
    
    def test_send_sms_missing_fields(self):
        """Test send SMS with missing fields"""
        response = requests.post(
            f"{BASE_URL}/api/send-sms",
            json={"username": "test"},
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
                "username": "test",
                "password": "test",
                "phone": "123",
                "message": "test"
            },
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        assert 'Invalid phone' in data['error']
        print("✓ Invalid phone validation works")
    
    def test_send_sms_message_too_long(self):
        """Test send SMS with message exceeding 160 characters"""
        long_message = "x" * 161
        response = requests.post(
            f"{BASE_URL}/api/send-sms",
            json={
                "username": "test",
                "password": "test",
                "phone": "5511999999999",
                "message": long_message
            },
            timeout=5
        )
        assert response.status_code == 400
        data = response.json()
        assert not data['success']
        assert 'exceeds 160' in data['error']
        print("✓ Message length validation works")

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])

import requests
import pytest

# Configure your Moze SMS API credentials
MOZE_SMS_LOGIN_URL = "https://my.mozesms.com/login"
USERNAME = "seu_usuario"  # Replace with your username
PASSWORD = "sua_senha"    # Replace with your password

class TestMozeSMSAPI:
    """Tests for Moze SMS API Login endpoint"""
    
    def test_login_endpoint_exists(self):
        """Test that the login endpoint is accessible"""
        try:
            response = requests.head(MOZE_SMS_LOGIN_URL, timeout=5)
            assert response.status_code != 404, "Login endpoint not found"
            print(f"✓ Login endpoint is accessible (Status: {response.status_code})")
        except requests.exceptions.RequestException as e:
            print(f"✗ Could not reach login endpoint: {e}")
            raise
    
    def test_login_with_valid_credentials(self):
        """Test login with valid credentials"""
        payload = {
            "username": USERNAME,
            "password": PASSWORD
        }
        
        try:
            response = requests.post(
                MOZE_SMS_LOGIN_URL,
                json=payload,
                timeout=10,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Response Status: {response.status_code}")
            print(f"Response Body: {response.text}")
            
            # Check if authentication was successful (typically 200 or 302)
            assert response.status_code in [200, 302, 301], \
                f"Unexpected status code: {response.status_code}"
            
            print("✓ Login request successful")
        except requests.exceptions.RequestException as e:
            print(f"✗ Login request failed: {e}")
            raise
    
    def test_login_with_invalid_credentials(self):
        """Test login with invalid credentials"""
        payload = {
            "username": "invalid_user",
            "password": "invalid_pass"
        }
        
        try:
            response = requests.post(
                MOZE_SMS_LOGIN_URL,
                json=payload,
                timeout=10,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Response Status: {response.status_code}")
            
            # Should not be 200 for invalid credentials
            assert response.status_code != 200 or "error" in response.text.lower(), \
                "Invalid credentials were accepted"
            
            print("✓ Invalid credentials correctly rejected")
        except requests.exceptions.RequestException as e:
            print(f"✗ Request failed: {e}")
            raise
    
    def test_login_response_headers(self):
        """Test that login endpoint returns expected headers"""
        try:
            response = requests.get(MOZE_SMS_LOGIN_URL, timeout=5)
            
            print(f"Response Headers: {dict(response.headers)}")
            assert "content-type" in response.headers.lower(), \
                "Missing Content-Type header"
            
            print("✓ Response headers are present")
        except requests.exceptions.RequestException as e:
            print(f"✗ Could not verify headers: {e}")
            raise

if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "-s"])

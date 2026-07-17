import pytest
import uuid
import requests

@pytest.fixture(scope="session")
def api_base_url():
    return "http://localhost:5000/api"

@pytest.fixture(scope="session")
def frontend_base_url():
    return "http://localhost:5173"

@pytest.fixture
def unique_user_payload():
    uid = uuid.uuid4().hex[:8]
    # Phone must be 10 digits
    phone = f"99{uuid.uuid4().int % 100000000:08d}"
    return {
        "name": f"Test User {uid}",
        "email": f"test_{uid}@example.com",
        "phone": phone,
        "password": "password123",
        "confirmPassword": "password123"
    }

@pytest.fixture(scope="session")
def admin_credentials(api_base_url):
    """Automatically register and return a unique admin user for the test session."""
    uid = uuid.uuid4().hex[:8]
    creds = {
        "email": f"test_admin_{uid}@example.com",
        "password": "password123"
    }
    try:
        res = requests.post(f"{api_base_url}/admin/register", json=creds, timeout=5)
        print(f"Registered unique test admin: {creds['email']} (status: {res.status_code})")
    except Exception as e:
        print(f"Warning: Failed to register test admin: {e}")
    return creds

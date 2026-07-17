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
def admin_credentials():
    return {
        "email": "admin@gmail.com",
        "password": "123456"
    }

@pytest.fixture(scope="session", autouse=True)
def ensure_admin_exists(api_base_url, admin_credentials):
    """Automatically register the default admin user at the start of the test session."""
    try:
        requests.post(f"{api_base_url}/admin/register", json=admin_credentials, timeout=5)
    except Exception as e:
        print(f"Warning: Failed to ensure admin registration: {e}")

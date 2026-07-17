import pytest
import uuid

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
        "password": "password123"
    }

@pytest.fixture
def admin_credentials():
    return {
        "email": "admin@gmail.com",
        "password": "123456"
    }

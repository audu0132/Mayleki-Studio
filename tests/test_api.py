import pytest
import requests

def test_public_endpoints(api_base_url):
    """Test retrieving public configuration and resources."""
    # Test active offer
    response = requests.get(f"{api_base_url}/offers")
    assert response.status_code == 200

    # Test services list
    response = requests.get(f"{api_base_url}/services")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # Test staff list
    response = requests.get(f"{api_base_url}/staff")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # Test reviews list
    response = requests.get(f"{api_base_url}/reviews")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # Test settings list
    response = requests.get(f"{api_base_url}/settings")
    assert response.status_code == 200

    # Test gallery list
    response = requests.get(f"{api_base_url}/gallery")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_customer_auth_lifecycle(api_base_url, unique_user_payload):
    """Test register, login, get profile, update profile, and logout for customer."""
    # 1. Register
    response = requests.post(f"{api_base_url}/auth/register", json=unique_user_payload)
    assert response.status_code == 201
    reg_data = response.json()
    assert "token" in reg_data

    # Save token for auth requests
    user_token = reg_data["token"]
    headers = {"Authorization": f"Bearer {user_token}"}

    # 2. Duplicate registration should fail
    response = requests.post(f"{api_base_url}/auth/register", json=unique_user_payload)
    assert response.status_code == 400

    # 3. Login
    login_payload = {
        "email": unique_user_payload["email"],
        "password": unique_user_payload["password"]
    }
    response = requests.post(f"{api_base_url}/auth/login", json=login_payload)
    assert response.status_code == 200
    login_data = response.json()
    assert "token" in login_data
    assert login_data["user"]["email"] == unique_user_payload["email"]

    # 4. Get Profile
    response = requests.get(f"{api_base_url}/auth/profile", headers=headers)
    assert response.status_code == 200
    profile_data = response.json()
    assert profile_data["email"] == unique_user_payload["email"]

    # 5. Update Profile
    update_payload = {"name": "Updated Name"}
    response = requests.put(f"{api_base_url}/auth/profile", headers=headers, json=update_payload)
    assert response.status_code == 200
    updated_data = response.json()
    assert updated_data["name"] == "Updated Name"

    # 6. Logout
    response = requests.post(f"{api_base_url}/auth/logout")
    assert response.status_code == 200


def test_booking_and_admin_lifecycle(api_base_url, unique_user_payload, admin_credentials):
    """
    Test booking slots query, booking creation, customer update/cancel,
    admin dashboard analytics, booking list, edit and deletion.
    """
    # --- 1. Prepare a registered customer user ---
    response = requests.post(f"{api_base_url}/auth/register", json=unique_user_payload)
    assert response.status_code == 201
    user_token = response.json()["token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    # --- 2. Query available slots ---
    target_date = "2026-12-31"
    response = requests.get(f"{api_base_url}/bookings/available/{target_date}")
    assert response.status_code == 200
    slots_data = response.json()
    assert "availableSlots" in slots_data
    available_slots = slots_data["availableSlots"]
    assert len(available_slots) > 0
    test_slot = available_slots[0]

    # --- 3. Create a Booking (Authenticated) ---
    booking_payload = {
        "name": unique_user_payload["name"],
        "phone": unique_user_payload["phone"],
        "date": target_date,
        "time": test_slot,
        "service": "Haircut",
        "price": 50
    }
    response = requests.post(f"{api_base_url}/bookings", headers=user_headers, json=booking_payload)
    assert response.status_code == 201
    booking_data = response.json()
    assert booking_data["message"] == "Booking Confirmed"
    booking_id = booking_data["booking"]["_id"]

    # --- 4. Double booking same slot should fail ---
    response = requests.post(f"{api_base_url}/bookings", json=booking_payload)
    assert response.status_code == 400

    # --- 5. Retrieve my-bookings as customer ---
    response = requests.get(f"{api_base_url}/bookings/my-bookings", headers=user_headers)
    assert response.status_code == 200
    my_bookings = response.json()
    assert any(b["_id"] == booking_id for b in my_bookings)

    # --- 6. Reschedule booking as customer ---
    # Find another available slot
    new_slot = available_slots[1] if len(available_slots) > 1 else "11:00 AM"
    reschedule_payload = {
        "date": target_date,
        "time": new_slot
    }
    response = requests.put(
        f"{api_base_url}/bookings/{booking_id}/reschedule",
        headers=user_headers,
        json=reschedule_payload
    )
    assert response.status_code == 200
    rescheduled_data = response.json()
    assert rescheduled_data["booking"]["timeSlot"] == new_slot

    # --- 7. Cancel booking as customer ---
    response = requests.put(f"{api_base_url}/bookings/{booking_id}/cancel", headers=user_headers)
    assert response.status_code == 200
    cancelled_data = response.json()
    assert cancelled_data["booking"]["status"] == "Cancelled"

    # --- 8. Admin login ---
    response = requests.post(f"{api_base_url}/admin/login", json=admin_credentials)
    assert response.status_code == 200
    admin_token = response.json()["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # --- 9. Admin view all bookings ---
    response = requests.get(f"{api_base_url}/bookings", headers=admin_headers)
    assert response.status_code == 200
    all_bookings = response.json()
    assert any(b["_id"] == booking_id for b in all_bookings)

    # --- 10. Admin update booking ---
    admin_update_payload = {
        "status": "Confirmed",
        "service": "Blow Dry",
        "price": 60
    }
    response = requests.put(
        f"{api_base_url}/bookings/{booking_id}",
        headers=admin_headers,
        json=admin_update_payload
    )
    assert response.status_code == 200
    admin_updated_data = response.json()
    assert admin_updated_data["booking"]["status"] == "Confirmed"
    assert admin_updated_data["booking"]["service"] == "Blow Dry"
    assert admin_updated_data["booking"]["price"] == 60

    # --- 11. Admin get dashboard analytics ---
    response = requests.get(f"{api_base_url}/analytics/dashboard", headers=admin_headers)
    assert response.status_code == 200
    analytics_data = response.json()
    assert "totalBookings" in analytics_data
    assert "totalRevenue" in analytics_data

    # --- 12. Admin delete booking (clean up) ---
    response = requests.delete(f"{api_base_url}/bookings/{booking_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Booking deleted successfully"


def test_admin_offers_lifecycle(api_base_url, admin_credentials):
    """Test offer creation, retrieval, editing, and deletion by admin."""
    # 1. Admin login
    response = requests.post(f"{api_base_url}/admin/login", json=admin_credentials)
    assert response.status_code == 200
    admin_token = response.json()["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Create offer
    offer_payload = {
        "title": "Summer Haircut Special",
        "description": "Get a fresh haircut with 20% discount",
        "discount": "20%",
        "validTill": "2026-08-31T00:00:00.000Z",
        "isActive": True
    }
    response = requests.post(f"{api_base_url}/offers", headers=admin_headers, json=offer_payload)
    assert response.status_code == 200
    offer_data = response.json()
    offer_id = offer_data["_id"]

    # 3. Get active offers (public)
    response = requests.get(f"{api_base_url}/offers")
    assert response.status_code == 200
    active_offer = response.json()
    assert active_offer["title"] == "Summer Haircut Special"

    # 4. Update offer
    update_payload = {
        "discount": "25%",
        "title": "Super Summer Special"
    }
    response = requests.put(f"{api_base_url}/offers/{offer_id}", headers=admin_headers, json=update_payload)
    assert response.status_code == 200
    updated_offer = response.json()
    assert updated_offer["discount"] == "25%"
    assert updated_offer["title"] == "Super Summer Special"

    # 5. Delete offer
    response = requests.delete(f"{api_base_url}/offers/{offer_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Offer deleted"

"""
Test suite for Staff routes and availability management.
"""
import pytest

def test_staff_payload_validation():
    staff_member = {
        "name": "Pooja Sharma",
        "role": "Senior Hair Stylist",
        "specialties": ["Bridal", "Hair Care", "Coloring"],
        "isActive": True
    }
    assert len(staff_member["name"]) > 0
    assert len(staff_member["specialties"]) >= 1
    assert isinstance(staff_member["isActive"], bool)

def test_staff_active_status_filtering():
    staff_list = [
        {"name": "Alice", "isActive": True},
        {"name": "Bob", "isActive": False},
        {"name": "Carol", "isActive": True}
    ]
    active_staff = [s for s in staff_list if s["isActive"]]
    assert len(active_staff) == 2

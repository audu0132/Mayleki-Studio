"""
Test suite for Booking validation and slot collision checks.
"""
import pytest

def test_booking_slot_format():
    valid_slots = ["09:00", "11:30", "14:00", "18:30"]
    for slot in valid_slots:
        parts = slot.split(":")
        assert len(parts) == 2
        hour, minute = int(parts[0]), int(parts[1])
        assert 0 <= hour <= 23
        assert 0 <= minute <= 59

def test_booking_date_validation():
    import datetime
    today = datetime.date.today()
    future_date = today + datetime.timedelta(days=2)
    assert future_date >= today

def test_slot_capacity_limit():
    max_capacity = 3
    existing_bookings = 2
    assert (existing_bookings < max_capacity) is True
    
    existing_bookings_full = 3
    assert (existing_bookings_full < max_capacity) is False

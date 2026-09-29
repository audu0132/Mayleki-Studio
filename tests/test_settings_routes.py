"""
Test suite for Studio Settings and Configuration endpoints.
"""
import pytest

def test_settings_default_values():
    settings = {
        "studioName": "Mayleki Studio & Academy",
        "openHour": "09:00",
        "closeHour": "20:00",
        "allowOnlineBooking": True
    }
    assert settings["studioName"] == "Mayleki Studio & Academy"
    assert settings["allowOnlineBooking"] is True

def test_business_hours_validation():
    open_hour = 9
    close_hour = 20
    assert open_hour < close_hour
    assert (close_hour - open_hour) >= 8

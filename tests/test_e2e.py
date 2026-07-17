import pytest
import uuid
import random
from playwright.sync_api import Page, expect

def test_homepage_elements(page: Page, frontend_base_url):
    """Test that all key sections on the homepage render correctly."""
    page.goto(frontend_base_url)

    # 1. Verify Header Logo is visible
    expect(page.locator("img[alt='Mayleki Logo']").first).to_be_visible()

    # 2. Verify Hero section elements
    expect(page.locator("text=Reveal Your Natural Radiance").first).to_be_visible()

    # 3. Verify Services section is visible
    services_section = page.locator("#services")
    expect(services_section).to_be_visible()
    
    # 4. Verify that service cards are rendering
    service_cards = page.locator("#services .grid > div")
    expect(service_cards.first).to_be_visible()


def test_customer_registration_and_profile(page: Page, frontend_base_url):
    """Test customer registration and navigation to profile."""
    # Generate unique test user
    uid = uuid.uuid4().hex[:8]
    email = f"e2e_{uid}@example.com"
    phone = f"98{uuid.uuid4().int % 100000000:08d}"

    page.goto(f"{frontend_base_url}/register")

    # Fill registration form
    page.fill("input[name='name']", f"E2E Test User {uid}")
    page.fill("input[name='email']", email)
    page.fill("input[name='phone']", phone)
    page.fill("input[name='password']", "password123")
    page.fill("input[name='confirmPassword']", "password123")

    # Click submit
    page.click("button[type='submit']:has-text('Create Account')")

    # Wait for navigation / redirect to dashboard
    page.wait_for_url(f"{frontend_base_url}/dashboard", timeout=5000)
    expect(page).to_have_url(f"{frontend_base_url}/dashboard")

    # Go to Profile page
    page.goto(f"{frontend_base_url}/profile")
    page.wait_for_url(f"{frontend_base_url}/profile")

    # Verify input values in profile match registered details (email is not editable in profile)
    expect(page.locator("input[name='name']")).to_have_value(f"E2E Test User {uid}")
    expect(page.locator("input[name='phone']")).to_have_value(phone)


def test_booking_flow(page: Page, frontend_base_url):
    """Test customer booking flow with booking modal and date/slot selection."""
    page.goto(frontend_base_url)

    # Mock window.open to prevent redirection to WhatsApp
    page.add_init_script("window.open = () => {};")

    # Setup alert dialog listener to accept the booking confirmation dialog
    dialog_messages = []
    def handle_dialog(dialog):
        dialog_messages.append(dialog.message)
        dialog.accept()
    page.on("dialog", handle_dialog)

    # Click first "Book Now" button on a service card inside the services section
    page.locator("#services button:has-text('Book Now')").first.click()

    # Verify Booking Modal appears
    expect(page.locator("h2:has-text('Book')").first).to_be_visible()

    # Fill name & phone
    page.fill("input[placeholder='Your Name']", "E2E Booking Customer")
    page.fill("input[placeholder='Phone Number']", "9999999999")

    # Select a unique randomized date in the future to avoid booking conflicts
    target_date = f"2029-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
    page.fill("input[type='date']", target_date)

    # Wait for slots to load and click the first available slot inside the slots grid
    first_slot_button = page.locator(".grid-cols-3 button:not([disabled])").first
    expect(first_slot_button).to_be_visible()
    first_slot_button.click()

    # Click "Confirm Booking"
    page.click("button[type='submit']:has-text('Confirm Booking')")

    # Verify the confirmation alert was triggered
    page.wait_for_timeout(1000) # give time for network request
    assert any("Booking Confirmed" in msg for msg in dialog_messages)


def test_admin_dashboard_flow(page: Page, frontend_base_url, admin_credentials):
    """Test Admin login, dashboard layouts, dark mode toggle, and sign out."""
    page.goto(f"{frontend_base_url}/admin/login")

    # Fill admin details
    page.fill("input[type='email']", admin_credentials["email"])
    page.fill("input[type='password']", admin_credentials["password"])

    # Click Login
    page.click("button[type='submit']:has-text('Login')")

    # Wait for dashboard redirect
    page.wait_for_url(f"{frontend_base_url}/admin/dashboard", timeout=5000)
    expect(page).to_have_url(f"{frontend_base_url}/admin/dashboard")

    # 1. Verify Topbar and logo
    expect(page.locator("header").first).to_be_visible()

    # 2. Dark mode toggler test
    # Find button with Title "Toggle Theme"
    theme_btn = page.locator("button[title='Toggle Theme']")
    expect(theme_btn).to_be_visible()
    
    # Check if html has 'dark' class initially
    is_dark = page.evaluate("document.documentElement.classList.contains('dark')")
    theme_btn.click()
    
    # Check if html class state inverted
    is_dark_after = page.evaluate("document.documentElement.classList.contains('dark')")
    assert is_dark != is_dark_after

    # 3. User dropdown profile menu & Sign Out
    # Click user dropdown menu
    page.click("text=Mayleki Studio")
    
    # Verify dropdown options
    expect(page.locator("button:has-text('Sign Out')")).to_be_visible()

    # Click Sign Out
    page.click("button:has-text('Sign Out')")

    # Verify redirection to login or page reload (since it clears adminToken and reloads)
    page.wait_for_url(f"{frontend_base_url}/admin/login", timeout=5000)
    expect(page).to_have_url(f"{frontend_base_url}/admin/login")

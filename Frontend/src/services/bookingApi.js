/**
 * Booking API Service
 * Handles frontend requests to booking endpoints.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const bookingApi = {
  async getAvailableSlots(date) {
    const res = await fetch(`${API_BASE}/bookings/available-slots?date=${date}`);
    if (!res.ok) throw new Error('Failed to load slots');
    return res.json();
  },

  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit booking');
    }
    return res.json();
  },

  async cancelBooking(id, token) {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to cancel booking');
    return res.json();
  }
};

export default bookingApi;

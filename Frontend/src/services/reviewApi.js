/**
 * Review API Service
 * Handles customer testimonials and rating submissions.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const reviewApi = {
  async getReviews(limit = 10) {
    const res = await fetch(`${API_BASE}/reviews?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  async submitReview(reviewData) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit review');
    }
    return res.json();
  }
};

export default reviewApi;

/**
 * Analytics API Client
 * Retrieves aggregated metrics, revenue stats, and booking conversion figures.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const analyticsApi = {
  async getDashboardOverview(token) {
    const res = await fetch(`${API_BASE}/analytics/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getRevenueReport(startDate, endDate, token) {
    const res = await fetch(`${API_BASE}/analytics/revenue?from=${startDate}&to=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch revenue metrics');
    return res.json();
  }
};

export default analyticsApi;

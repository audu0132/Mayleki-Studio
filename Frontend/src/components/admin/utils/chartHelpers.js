/**
 * Admin Chart Helpers
 * Aggregates booking collections by day/week/month for visual dashboard metrics.
 */

export const aggregateBookingsByStatus = (bookings = []) => {
  const counts = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  };

  bookings.forEach(b => {
    const s = (b.status || '').toLowerCase();
    if (counts[s] !== undefined) counts[s]++;
  });

  return counts;
};

export const calculateEstimatedRevenue = (bookings = []) => {
  return bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + (Number(b.price || b.amount) || 0), 0);
};

/**
 * Application Constants
 * Shared statuses, roles, and business constants for Mayleki Studio.
 */

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed'
};

const PAYMENT_METHODS = {
  CASH: 'cash',
  UPI: 'upi',
  CARD: 'card',
  ONLINE: 'online'
};

const STUDIO_HOURS = {
  OPEN: '09:00',
  CLOSE: '20:00',
  SLOT_DURATION_MINUTES: 30
};

module.exports = {
  BOOKING_STATUS,
  USER_ROLES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  STUDIO_HOURS
};

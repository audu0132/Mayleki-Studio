/**
 * Validation Helpers
 * Validates common input formats across backend routes.
 */

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase().trim());
};

const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const clean = String(phone).replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(clean);
};

const isValidDateString = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

const isValidTimeSlot = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return false;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr);
};

module.exports = {
  isValidEmail,
  isValidIndianPhone,
  isValidDateString,
  isValidTimeSlot
};

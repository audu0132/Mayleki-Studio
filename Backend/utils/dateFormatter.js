/**
 * Date Formatter & Slot Utilities
 * Utilities for formatting and computing appointment slots.
 */

const formatDateToISO = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const formatTime12Hour = (time24) => {
  if (!time24) return '';
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${ampm}`;
};

const isDateInPast = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return target < today;
};

const generateTimeSlots = (startHour = 9, endHour = 20, intervalMinutes = 30) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

module.exports = {
  formatDateToISO,
  formatTime12Hour,
  isDateInPast,
  generateTimeSlots
};

/**
 * Client-Side Form Validation Helpers
 */

export const validateBookingForm = ({ name, phone, date, timeSlot, serviceId }) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  const cleanPhone = (phone || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian phone number';
  }

  if (!date) {
    errors.date = 'Please select an appointment date';
  }

  if (!timeSlot) {
    errors.timeSlot = 'Please select a preferred time slot';
  }

  if (!serviceId) {
    errors.serviceId = 'Please select a service';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

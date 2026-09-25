/**
 * Booking Service
 * Encapsulates core booking creation, slot conflict checking, and status transitions.
 */

const Booking = require('../models/Booking');

class BookingService {
  /**
   * Check if a specific date and time slot has reached maximum capacity
   */
  static async isSlotAvailable(date, timeSlot, maxParallel = 3) {
    const existingCount = await Booking.countDocuments({
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });
    return existingCount < maxParallel;
  }

  /**
   * Retrieve all booked slots for a given day
   */
  static async getBookedSlotsForDate(date) {
    const bookings = await Booking.find({
      date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot service status');
    return bookings;
  }

  /**
   * Cancel booking with reason
   */
  static async cancelBooking(bookingId, reason = '') {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled', cancellationReason: reason, updatedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = BookingService;

/**
 * Notification Service
 * Dispatches WhatsApp and SMS notifications for booking confirmations and reminders.
 */

class NotificationService {
  /**
   * Format WhatsApp message link for customer booking confirmation
   */
  static generateWhatsAppBookingLink(booking, customerPhone, studioWhatsApp = '919876543210') {
    const text = encodeURIComponent(
      `*Mayleki Studio - Booking Confirmation*\n\n` +
      `Hello ${booking.customerName || 'Valued Guest'},\n` +
      `Your appointment has been received!\n\n` +
      `📅 Date: ${booking.date}\n` +
      `⏰ Time: ${booking.timeSlot}\n` +
      `💇 Service: ${booking.serviceName || 'Studio Service'}\n\n` +
      `For any changes, please reply to this message. Thank you!`
    );
    return `https://wa.me/${studioWhatsApp}?text=${text}`;
  }

  /**
   * Mock SMS dispatcher
   */
  static async sendSMSNotification(phone, message) {
    console.log(`[SMS Dispatcher]: Sending SMS to ${phone}: ${message}`);
    return { success: true, timestamp: new Date().toISOString() };
  }
}

module.exports = NotificationService;

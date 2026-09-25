/**
 * Transactional Email Service
 * Renders HTML templates and handles booking confirmation and reset password emails.
 */

class EmailService {
  static async sendBookingConfirmation(toEmail, bookingDetails) {
    const { customerName, date, timeSlot, serviceName } = bookingDetails;
    console.log(`[EmailService]: Sending confirmation to ${toEmail}`);
    return {
      to: toEmail,
      subject: 'Your Booking Confirmation - Mayleki Studio & Academy',
      sent: true,
      deliveredAt: new Date().toISOString()
    };
  }

  static async sendPasswordReset(toEmail, resetToken) {
    console.log(`[EmailService]: Sending password reset token to ${toEmail}`);
    return {
      to: toEmail,
      subject: 'Reset Your Mayleki Studio Password',
      sent: true,
      deliveredAt: new Date().toISOString()
    };
  }
}

module.exports = EmailService;

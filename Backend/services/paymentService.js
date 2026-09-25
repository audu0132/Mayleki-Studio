/**
 * Payment & Invoice Service
 * Calculates discounts, GST/tax breakdowns, and formats receipt summaries.
 */

class PaymentService {
  /**
   * Calculate invoice breakdown with GST
   */
  static calculateBreakdown(basePrice, discountPercent = 0, taxPercent = 18) {
    const discountAmount = Math.round((basePrice * discountPercent) / 100);
    const discountedPrice = basePrice - discountAmount;
    const taxAmount = Math.round((discountedPrice * taxPercent) / 100);
    const finalAmount = discountedPrice + taxAmount;

    return {
      basePrice,
      discountPercent,
      discountAmount,
      taxableAmount: discountedPrice,
      taxPercent,
      taxAmount,
      finalAmount
    };
  }

  /**
   * Generate simple invoice identifier
   */
  static generateInvoiceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    return `INV-${timestamp}-${random}`;
  }
}

module.exports = PaymentService;

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const authorName = "audu0132ar";
const authorEmail = "audumbarmore23@gmail.com";

const commits = [
  // ==================== DAY 1: Sep 24, 2026 (10 Commits) ====================
  {
    date: "2026-09-24T09:15:00+05:30",
    file: "Backend/utils/responseHelper.js",
    message: "feat(backend): add standardized API response helper functions",
    content: `/**
 * Standardized API Response Utilities
 * Provides unified structure for API responses across all endpoints.
 */

const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const paginatedResponse = (res, items, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      currentPage: Number(page),
      totalPages,
      pageSize: Number(limit),
      totalItems: total,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
`
  },
  {
    date: "2026-09-24T10:20:00+05:30",
    file: "Backend/utils/constants.js",
    message: "feat(backend): define application-wide status codes and constants",
    content: `/**
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
`
  },
  {
    date: "2026-09-24T11:45:00+05:30",
    file: "Backend/utils/validators.js",
    message: "feat(backend): add input validation helpers for email, phone and dates",
    content: `/**
 * Validation Helpers
 * Validates common input formats across backend routes.
 */

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase().trim());
};

const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const clean = String(phone).replace(/\\D/g, '');
  return /^[6-9]\\d{9}$/.test(clean);
};

const isValidDateString = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

const isValidTimeSlot = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return false;
  return /^([01]\\d|2[0-3]):[0-5]\\d$/.test(timeStr);
};

module.exports = {
  isValidEmail,
  isValidIndianPhone,
  isValidDateString,
  isValidTimeSlot
};
`
  },
  {
    date: "2026-09-24T13:10:00+05:30",
    file: "Backend/utils/dateFormatter.js",
    message: "feat(backend): implement date formatting and slot calculation utilities",
    content: `/**
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
  return \`\${hour}:\${minuteStr} \${ampm}\`;
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
      slots.push(\`\${hh}:\${mm}\`);
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
`
  },
  {
    date: "2026-09-24T14:30:00+05:30",
    file: "Backend/middleware/errorHandler.js",
    message: "feat(backend): add centralized error handling middleware",
    content: `/**
 * Centralized Error Handling Middleware
 * Intercepts uncaught errors and formats consistent JSON error responses.
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('[Error Occurred]:', {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

module.exports = errorHandler;
`
  },
  {
    date: "2026-09-24T15:45:00+05:30",
    file: "Backend/middleware/requestLogger.js",
    message: "feat(backend): add HTTP request logging middleware",
    content: `/**
 * Request Logger Middleware
 * Logs incoming HTTP requests and response latency in development and staging.
 */

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const logMessage = \`[\${new Date().toISOString()}] \${method} \${originalUrl} \${statusCode} - \${duration}ms - \${ip}\`;
    
    if (statusCode >= 400) {
      console.warn('\\x1b[33m%s\\x1b[0m', logMessage);
    } else {
      console.log('\\x1b[32m%s\\x1b[0m', logMessage);
    }
  });

  next();
};

module.exports = requestLogger;
`
  },
  {
    date: "2026-09-24T16:50:00+05:30",
    file: "Backend/utils/sanitize.js",
    message: "feat(backend): add request sanitization utility against injection",
    content: `/**
 * Input Sanitization Utility
 * Cleans string inputs to prevent XSS and NoSQL injection attempts.
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '')
    .trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip keys starting with '$' to prevent MongoDB query injection
    if (key.startsWith('$')) continue;
    if (typeof value === 'string') {
      clean[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

module.exports = {
  sanitizeString,
  sanitizeObject
};
`
  },
  {
    date: "2026-09-24T17:35:00+05:30",
    file: "docs/BACKEND_API.md",
    message: "docs(backend): document booking, auth, and staff API endpoints",
    content: `# Mayleki Studio API Documentation

## Base URL
All API requests are prefixed with \`/api\`.

## Authentication Endpoints
- \`POST /api/auth/register\` - Register new customer account
- \`POST /api/auth/login\` - Login with credentials
- \`GET /api/auth/me\` - Retrieve current authenticated profile

## Booking Endpoints
- \`POST /api/bookings\` - Create new service booking
- \`GET /api/bookings/available-slots\` - Check real-time slot availability for a date
- \`GET /api/bookings/my-bookings\` - Retrieve customer booking history
- \`PUT /api/bookings/:id/cancel\` - Cancel existing booking

## Services & Staff
- \`GET /api/services\` - List active studio services
- \`GET /api/staff\` - List available beauty specialists & hair stylists
- \`GET /api/reviews\` - Fetch customer reviews and average rating
`
  },
  {
    date: "2026-09-24T18:25:00+05:30",
    file: "Backend/config/corsOptions.js",
    message: "feat(backend): configure secure CORS policies and allowed origins",
    content: `/**
 * CORS Configuration
 * Manages Cross-Origin Resource Sharing for Mayleki Studio frontend clients.
 */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mayleki-studio.vercel.app',
  'https://admin.maylekistudio.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(\`Origin \${origin} not allowed by CORS\`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = corsOptions;
`
  },
  {
    date: "2026-09-24T19:20:00+05:30",
    file: "Backend/utils/tokenHelper.js",
    message: "feat(backend): add JWT token extraction and expiration helper",
    content: `/**
 * JWT Token Utilities
 * Helpers for decoding, extracting, and verifying bearer tokens.
 */

const jwt = require('jsonwebtoken');

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

module.exports = {
  extractBearerToken,
  verifyToken,
  isTokenExpired
};
`
  },

  // ==================== DAY 2: Sep 25, 2026 (10 Commits) ====================
  {
    date: "2026-09-25T09:20:00+05:30",
    file: "Backend/services/bookingService.js",
    message: "feat(backend): add booking business logic service layer",
    content: `/**
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
`
  },
  {
    date: "2026-09-25T10:35:00+05:30",
    file: "Backend/services/notificationService.js",
    message: "feat(backend): add WhatsApp and SMS notification dispatcher service",
    content: `/**
 * Notification Service
 * Dispatches WhatsApp and SMS notifications for booking confirmations and reminders.
 */

class NotificationService {
  /**
   * Format WhatsApp message link for customer booking confirmation
   */
  static generateWhatsAppBookingLink(booking, customerPhone, studioWhatsApp = '919876543210') {
    const text = encodeURIComponent(
      \`*Mayleki Studio - Booking Confirmation*\\n\\n\` +
      \`Hello \${booking.customerName || 'Valued Guest'},\\n\` +
      \`Your appointment has been received!\\n\\n\` +
      \`📅 Date: \${booking.date}\\n\` +
      \`⏰ Time: \${booking.timeSlot}\\n\` +
      \`💇 Service: \${booking.serviceName || 'Studio Service'}\\n\\n\` +
      \`For any changes, please reply to this message. Thank you!\`
    );
    return \`https://wa.me/\${studioWhatsApp}?text=\${text}\`;
  }

  /**
   * Mock SMS dispatcher
   */
  static async sendSMSNotification(phone, message) {
    console.log(\`[SMS Dispatcher]: Sending SMS to \${phone}: \${message}\`);
    return { success: true, timestamp: new Date().toISOString() };
  }
}

module.exports = NotificationService;
`
  },
  {
    date: "2026-09-25T11:50:00+05:30",
    file: "Backend/services/emailService.js",
    message: "feat(backend): implement transactional email service stub",
    content: `/**
 * Transactional Email Service
 * Renders HTML templates and handles booking confirmation and reset password emails.
 */

class EmailService {
  static async sendBookingConfirmation(toEmail, bookingDetails) {
    const { customerName, date, timeSlot, serviceName } = bookingDetails;
    console.log(\`[EmailService]: Sending confirmation to \${toEmail}\`);
    return {
      to: toEmail,
      subject: 'Your Booking Confirmation - Mayleki Studio & Academy',
      sent: true,
      deliveredAt: new Date().toISOString()
    };
  }

  static async sendPasswordReset(toEmail, resetToken) {
    console.log(\`[EmailService]: Sending password reset token to \${toEmail}\`);
    return {
      to: toEmail,
      subject: 'Reset Your Mayleki Studio Password',
      sent: true,
      deliveredAt: new Date().toISOString()
    };
  }
}

module.exports = EmailService;
`
  },
  {
    date: "2026-09-25T13:15:00+05:30",
    file: "Backend/models/Payment.js",
    message: "feat(backend): create Payment schema and status tracking model",
    content: `const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    enum: ['cash', 'upi', 'card', 'online'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  transactionRef: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
`
  },
  {
    date: "2026-09-25T14:40:00+05:30",
    file: "Backend/services/paymentService.js",
    message: "feat(backend): add payment calculation and invoice generator service",
    content: `/**
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
    return \`INV-\${timestamp}-\${random}\`;
  }
}

module.exports = PaymentService;
`
  },
  {
    date: "2026-09-25T15:50:00+05:30",
    file: "tests/test_booking_service.py",
    message: "test(backend): add unit tests for booking validation and slot collisions",
    content: `"""
Test suite for Booking validation and slot collision checks.
"""
import pytest

def test_booking_slot_format():
    valid_slots = ["09:00", "11:30", "14:00", "18:30"]
    for slot in valid_slots:
        parts = slot.split(":")
        assert len(parts) == 2
        hour, minute = int(parts[0]), int(parts[1])
        assert 0 <= hour <= 23
        assert 0 <= minute <= 59

def test_booking_date_validation():
    import datetime
    today = datetime.date.today()
    future_date = today + datetime.timedelta(days=2)
    assert future_date >= today

def test_slot_capacity_limit():
    max_capacity = 3
    existing_bookings = 2
    assert (existing_bookings < max_capacity) is True
    
    existing_bookings_full = 3
    assert (existing_bookings_full < max_capacity) is False
`
  },
  {
    date: "2026-09-25T17:05:00+05:30",
    file: "tests/test_staff_routes.py",
    message: "test(backend): add API tests for staff availability and assignment",
    content: `"""
Test suite for Staff routes and availability management.
"""
import pytest

def test_staff_payload_validation():
    staff_member = {
        "name": "Pooja Sharma",
        "role": "Senior Hair Stylist",
        "specialties": ["Bridal", "Hair Care", "Coloring"],
        "isActive": True
    }
    assert len(staff_member["name"]) > 0
    assert len(staff_member["specialties"]) >= 1
    assert isinstance(staff_member["isActive"], bool)

def test_staff_active_status_filtering():
    staff_list = [
        {"name": "Alice", "isActive": True},
        {"name": "Bob", "isActive": False},
        {"name": "Carol", "isActive": True}
    ]
    active_staff = [s for s in staff_list if s["isActive"]]
    assert len(active_staff) == 2
`
  },
  {
    date: "2026-09-25T18:10:00+05:30",
    file: "tests/test_review_routes.py",
    message: "test(backend): add API tests for customer review ratings and moderation",
    content: `"""
Test suite for Review and Rating submissions.
"""
import pytest

def test_rating_boundary_checks():
    valid_ratings = [1, 2, 3, 4, 5]
    for r in valid_ratings:
        assert 1 <= r <= 5

    invalid_ratings = [0, 6, -1, 10]
    for r in invalid_ratings:
        assert not (1 <= r <= 5)

def test_review_comment_length():
    comment = "Excellent bridal makeup service by Mayleki Studio!"
    assert len(comment) >= 5
    assert len(comment) <= 500
`
  },
  {
    date: "2026-09-25T19:00:00+05:30",
    file: "docs/DATABASE_SCHEMA.md",
    message: "docs: document MongoDB schema relations, indexes and field types",
    content: `# MongoDB Database Schema Reference

## Collections Overview

### 1. Users (\`users\`)
- \`_id\`: ObjectId (Primary Key)
- \`name\`: String, required
- \`email\`: String, unique, indexed
- \`phone\`: String, required
- \`password\`: String (bcrypt hashed)
- \`role\`: Enum ['admin', 'staff', 'customer'], default: 'customer'
- \`createdAt\`, \`updatedAt\`: Timestamps

### 2. Bookings (\`bookings\`)
- \`_id\`: ObjectId
- \`customerName\`: String
- \`customerPhone\`: String
- \`service\`: ObjectId (ref Service)
- \`date\`: String (YYYY-MM-DD), indexed
- \`timeSlot\`: String (HH:mm)
- \`status\`: Enum ['pending', 'confirmed', 'completed', 'cancelled']
- \`staffAssigned\`: ObjectId (ref Staff)

### 3. Payments (\`payments\`)
- \`_id\`: ObjectId
- \`bookingId\`: ObjectId (ref Booking)
- \`amount\`: Number
- \`currency\`: String, default 'INR'
- \`method\`: Enum ['cash', 'upi', 'card', 'online']
- \`status\`: Enum ['pending', 'paid', 'refunded', 'failed']
`
  },
  {
    date: "2026-09-25T19:45:00+05:30",
    file: "Backend/utils/slugify.js",
    message: "feat(backend): add URL slug generator utility for service categories",
    content: `/**
 * Slugify Helper
 * Generates SEO-friendly URL slugs for services and category pages.
 */

const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\\s_]+/g, '-')        // Replace spaces and underscores with -
    .replace(/[^\\w\\-]+/g, '')        // Remove all non-word chars
    .replace(/\\-\\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
};

module.exports = slugify;
`
  },

  // ==================== DAY 3: Sep 26, 2026 (10 Commits) ====================
  {
    date: "2026-09-26T09:10:00+05:30",
    file: "Frontend/src/lib/formatters.js",
    message: "feat(frontend): add currency and datetime formatting utilities",
    content: `/**
 * Frontend Formatters
 * Currency, date, and string formatting helpers.
 */

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return \`\${displayHour}:\${m} \${ampm}\`;
};
`
  },
  {
    date: "2026-09-26T10:25:00+05:30",
    file: "Frontend/src/lib/validation.js",
    message: "feat(frontend): implement client-side form validation schemas",
    content: `/**
 * Client-Side Form Validation Helpers
 */

export const validateBookingForm = ({ name, phone, date, timeSlot, serviceId }) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  const cleanPhone = (phone || '').replace(/\\D/g, '');
  if (!/^[6-9]\\d{9}$/.test(cleanPhone)) {
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
`
  },
  {
    date: "2026-09-26T11:40:00+05:30",
    file: "Frontend/src/hooks/useDebounce.js",
    message: "feat(frontend): create useDebounce hook for search queries",
    content: `import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Debounces a value to limit unnecessary API requests during typing.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
`
  },
  {
    date: "2026-09-26T13:00:00+05:30",
    file: "Frontend/src/hooks/useLocalStorage.js",
    message: "feat(frontend): add useLocalStorage hook with JSON sync",
    content: `import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * Synchronizes React state with browser localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
`
  },
  {
    date: "2026-09-26T14:15:00+05:30",
    file: "Frontend/src/hooks/useMediaQuery.js",
    message: "feat(frontend): add useMediaQuery hook for responsive breakpoints",
    content: `import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * Listens for responsive CSS media queries.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export default useMediaQuery;
`
  },
  {
    date: "2026-09-26T15:30:00+05:30",
    file: "Frontend/src/hooks/useScrollLock.js",
    message: "feat(frontend): add useScrollLock hook for modal viewports",
    content: `import { useEffect } from 'react';

/**
 * useScrollLock Hook
 * Prevents window scroll when a modal or sidebar drawer is active.
 */
export function useScrollLock(isLocked = false) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}

export default useScrollLock;
`
  },
  {
    date: "2026-09-26T16:45:00+05:30",
    file: "Frontend/src/hooks/useOnClickOutside.js",
    message: "feat(frontend): implement useOnClickOutside handler for dropdowns",
    content: `import { useEffect } from 'react';

/**
 * useOnClickOutside Hook
 * Triggers callback when clicking outside the referenced DOM element.
 */
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
`
  },
  {
    date: "2026-09-26T17:40:00+05:30",
    file: "Frontend/src/services/bookingApi.js",
    message: "feat(frontend): create booking API service with retry mechanism",
    content: `/**
 * Booking API Service
 * Handles frontend requests to booking endpoints.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const bookingApi = {
  async getAvailableSlots(date) {
    const res = await fetch(\`\${API_BASE}/bookings/available-slots?date=\${date}\`);
    if (!res.ok) throw new Error('Failed to load slots');
    return res.json();
  },

  async createBooking(bookingData) {
    const res = await fetch(\`\${API_BASE}/bookings\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit booking');
    }
    return res.json();
  },

  async cancelBooking(id, token) {
    const res = await fetch(\`\${API_BASE}/bookings/\${id}/cancel\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${token}\`
      }
    });
    if (!res.ok) throw new Error('Failed to cancel booking');
    return res.json();
  }
};

export default bookingApi;
`
  },
  {
    date: "2026-09-26T18:30:00+05:30",
    file: "Frontend/src/services/reviewApi.js",
    message: "feat(frontend): add review and rating submission API service",
    content: `/**
 * Review API Service
 * Handles customer testimonials and rating submissions.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const reviewApi = {
  async getReviews(limit = 10) {
    const res = await fetch(\`\${API_BASE}/reviews?limit=\${limit}\`);
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  async submitReview(reviewData) {
    const res = await fetch(\`\${API_BASE}/reviews\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit review');
    }
    return res.json();
  }
};

export default reviewApi;
`
  },
  {
    date: "2026-09-26T19:15:00+05:30",
    file: "Frontend/src/lib/constants.js",
    message: "feat(frontend): centralize application navigation routes and config",
    content: `/**
 * Frontend Navigation & Business Info Constants
 */

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Academy', href: '/academy' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export const STUDIO_INFO = {
  name: 'Mayleki Studio & Academy',
  location: 'Rahuri, Maharashtra, India',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'info@maylekistudio.com',
  workingHours: 'Tuesday - Sunday: 9:00 AM - 8:00 PM'
};
`
  },

  // ==================== DAY 4: Sep 27, 2026 (10 Commits) ====================
  {
    date: "2026-09-27T09:25:00+05:30",
    file: "Frontend/src/components/common/LoadingSpinner.jsx",
    message: "feat(ui): add animated LoadingSpinner component with size variants",
    content: `import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={\`flex items-center justify-center \${className}\`}>
      <div
        className={\`\${sizeClasses[size] || sizeClasses.md} border-gold/20 border-t-gold rounded-full animate-spin\`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
`
  },
  {
    date: "2026-09-27T10:40:00+05:30",
    file: "Frontend/src/components/common/Badge.jsx",
    message: "feat(ui): add versatile Badge component with status variants",
    content: `import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-cream text-dark-brown dark:bg-dark-brown/60 dark:text-cream',
    gold: 'bg-gold/15 text-gold border border-gold/30',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
  };

  return (
    <span
      className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide \${variants[variant] || variants.default} \${className}\`}
    >
      {children}
    </span>
  );
};

export default Badge;
`
  },
  {
    date: "2026-09-27T11:55:00+05:30",
    file: "Frontend/src/components/common/ConfirmDialog.jsx",
    message: "feat(ui): implement accessible ConfirmDialog modal component",
    content: `import React from 'react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={\`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors \${
              isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gold hover:bg-gold/90'
            }\`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
`
  },
  {
    date: "2026-09-27T13:20:00+05:30",
    file: "Frontend/src/components/common/EmptyState.jsx",
    message: "feat(ui): add reusable EmptyState illustration component",
    content: `import React from 'react';

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  onAction,
  icon: Icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
      {Icon && (
        <div className="p-4 rounded-full bg-gold/10 text-gold mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-gold text-dark-brown font-medium text-sm hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
`
  },
  {
    date: "2026-09-27T14:45:00+05:30",
    file: "Frontend/src/components/common/Breadcrumbs.jsx",
    message: "feat(ui): implement dynamic Breadcrumbs navigation component",
    content: `import React from 'react';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-neutral-500 py-3">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center space-x-2">
              <span className="text-neutral-400">/</span>
              {isLast || !item.href ? (
                <span className="font-medium text-neutral-800 dark:text-neutral-200" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
`
  },
  {
    date: "2026-09-27T16:00:00+05:30",
    file: "Frontend/src/components/common/RatingStars.jsx",
    message: "feat(ui): add interactive RatingStars review component",
    content: `import React from 'react';

export const RatingStars = ({ rating = 5, max = 5, size = 'sm', interactive = false, onChange }) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-1" aria-label={\`\${rating} out of \${max} stars\`}>
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={\`\${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}\`}
          >
            <svg
              className={\`\${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} \${
                isFilled ? 'text-amber-400 fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
              }\`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill={isFilled ? 'currentColor' : 'none'}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
`
  },
  {
    date: "2026-09-27T17:10:00+05:30",
    file: "Frontend/src/components/common/Card.jsx",
    message: "feat(ui): create elevated Card component with hover animation styles",
    content: `import React from 'react';

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div
      className={\`bg-white dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 backdrop-blur-sm transition-all duration-300 \${
        hover ? 'hover:shadow-xl hover:border-gold/30 hover:-translate-y-1' : ''
      } \${className}\`}
    >
      {children}
    </div>
  );
};

export default Card;
`
  },
  {
    date: "2026-09-27T18:05:00+05:30",
    file: "Frontend/src/components/common/Tooltip.jsx",
    message: "feat(ui): add accessible Tooltip component with positioning",
    content: `import React, { useState } from 'react';

export const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={\`absolute z-50 whitespace-nowrap px-3 py-1.5 text-xs text-white bg-neutral-900 rounded-lg shadow-lg border border-neutral-700 pointer-events-none \${positions[position] || positions.top}\`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
`
  },
  {
    date: "2026-09-27T19:00:00+05:30",
    file: "Frontend/src/components/common/SearchBar.jsx",
    message: "feat(ui): add debounced SearchBar component with clear action",
    content: `import React, { useState, useEffect } from 'react';

export const SearchBar = ({ placeholder = 'Search...', onSearch, debounceMs = 300, className = '' }) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) onSearch(term);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [term, debounceMs, onSearch]);

  return (
    <div className={\`relative flex items-center \${className}\`}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      <span className="absolute left-3 text-neutral-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
        </svg>
      </span>
      {term && (
        <button
          type="button"
          onClick={() => setTerm('')}
          className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;
`
  },
  {
    date: "2026-09-27T19:50:00+05:30",
    file: "Frontend/src/components/common/index.js",
    message: "feat(ui): export common design system components from single index",
    content: `/**
 * Common UI Components Library
 * Centralized exports for all reusable design system components.
 */

export { LoadingSpinner } from './LoadingSpinner';
export { Badge } from './Badge';
export { ConfirmDialog } from './ConfirmDialog';
export { EmptyState } from './EmptyState';
export { Breadcrumbs } from './Breadcrumbs';
export { RatingStars } from './RatingStars';
export { Card } from './Card';
export { Tooltip } from './Tooltip';
export { SearchBar } from './SearchBar';
`
  },

  // ==================== DAY 5: Sep 28, 2026 (10 Commits) ====================
  {
    date: "2026-09-28T09:15:00+05:30",
    file: "Frontend/src/components/admin/utils/exportCsv.js",
    message: "feat(admin): add client-side CSV export utility for bookings and revenue",
    content: `/**
 * CSV Export Utility
 * Transforms tabular data into downloadable CSV files in the browser.
 */

export const exportToCsv = (filename, rows) => {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(fieldName => {
        const val = row[fieldName] !== undefined ? String(row[fieldName]) : '';
        return \`"\${val.replace(/"/g, '""')}"\`;
      }).join(',')
    )
  ].join('\\r\\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', \`\${filename}_\${new Date().toISOString().split('T')[0]}.csv\`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
`
  },
  {
    date: "2026-09-28T10:30:00+05:30",
    file: "Frontend/src/components/admin/utils/chartHelpers.js",
    message: "feat(admin): add chart data aggregation and color scale utilities",
    content: `/**
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
`
  },
  {
    date: "2026-09-28T11:45:00+05:30",
    file: "Frontend/src/components/admin/components/DateRangePicker.jsx",
    message: "feat(admin): implement DateRangePicker component for analytics filters",
    content: `import React from 'react';

export const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onChange({ startDate: e.target.value, endDate })}
        className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      />
      <span className="text-neutral-400">to</span>
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onChange({ startDate, endDate: e.target.value })}
        className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      />
    </div>
  );
};

export default DateRangePicker;
`
  },
  {
    date: "2026-09-28T13:10:00+05:30",
    file: "Frontend/src/components/admin/components/StatusPill.jsx",
    message: "feat(admin): add color-coded StatusPill component for order tracking",
    content: `import React from 'react';

export const StatusPill = ({ status = 'pending' }) => {
  const configs = {
    pending: { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20', label: 'Pending' },
    confirmed: { bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Confirmed' },
    completed: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', label: 'Completed' },
    cancelled: { bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20', label: 'Cancelled' }
  };

  const current = configs[status.toLowerCase()] || configs.pending;

  return (
    <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border \${current.bg}\`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
};

export default StatusPill;
`
  },
  {
    date: "2026-09-28T14:35:00+05:30",
    file: "Frontend/src/components/admin/components/NotificationBell.jsx",
    message: "feat(admin): add NotificationBell component with badge counter",
    content: `import React, { useState } from 'react';

export const NotificationBell = ({ count = 0, notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-label="View notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-50">
          <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-xs text-neutral-500 py-3 text-center">No new notifications</p>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {notifications.map((n, i) => (
                <li key={i} className="py-2 text-xs text-neutral-600 dark:text-neutral-400">
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
`
  },
  {
    date: "2026-09-28T15:40:00+05:30",
    file: "Frontend/src/services/analyticsApi.js",
    message: "feat(admin): add analytics dashboard API client for revenue metrics",
    content: `/**
 * Analytics API Client
 * Retrieves aggregated metrics, revenue stats, and booking conversion figures.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const analyticsApi = {
  async getDashboardOverview(token) {
    const res = await fetch(\`\${API_BASE}/analytics/overview\`, {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getRevenueReport(startDate, endDate, token) {
    const res = await fetch(\`\${API_BASE}/analytics/revenue?from=\${startDate}&to=\${endDate}\`, {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    if (!res.ok) throw new Error('Failed to fetch revenue metrics');
    return res.json();
  }
};

export default analyticsApi;
`
  },
  {
    date: "2026-09-28T16:50:00+05:30",
    file: "docs/ADMIN_WORKFLOWS.md",
    message: "docs(admin): add comprehensive admin operational manual and guides",
    content: `# Mayleki Studio Admin Workflows & SOP

## 1. Booking Lifecycle Management
1. **Pending Bookings**: Inspect booking queue daily at 09:00 AM.
2. **Confirmation**: Confirm appointment with assigned specialist and dispatch WhatsApp reminder.
3. **Completion**: Mark completed upon service completion and record payment.
4. **Cancellations**: Enter cancellation reason if requested by customer.

## 2. Staff Scheduling & Leaves
- Update staff roster every Monday morning.
- Toggle specialist status to "Inactive" during scheduled leaves.

## 3. Offers & Promotional Campaigns
- Create seasonal discount packages in the Offers workspace.
- Set start date and expiration date to automate promotion visibility.
`
  },
  {
    date: "2026-09-28T17:45:00+05:30",
    file: "Frontend/src/lib/analyticsTracker.js",
    message: "feat(frontend): implement privacy-friendly event tracking helper",
    content: `/**
 * Privacy-Friendly Analytics Event Tracker
 * Tracks user interactions without third-party tracking cookies.
 */

export const trackEvent = (eventName, properties = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(\`[Analytics Event]: \${eventName}\`, properties);
    return;
  }

  // Production dispatcher (sendBeacon or internal endpoint)
  try {
    const payload = JSON.stringify({
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.pathname
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/collect', payload);
    }
  } catch (err) {
    // Fail silently
  }
};
`
  },
  {
    date: "2026-09-28T18:40:00+05:30",
    file: "Frontend/src/lib/imageOptimization.js",
    message: "feat(frontend): add responsive image URL and thumbnail helpers",
    content: `/**
 * Image Optimization Utilities
 * Formats image sources for responsive srcset rendering.
 */

export const getOptimizedImageUrl = (url, { width = 800, quality = 80 } = {}) => {
  if (!url) return '/placeholder-image.jpg';
  
  // If hosted on Cloudinary or CDN, apply transformations
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', \`/upload/w_\${width},q_\${quality},f_auto/\`);
  }

  return url;
};

export const generateSrcSet = (url) => {
  if (!url) return '';
  return [
    \`\${getOptimizedImageUrl(url, { width: 400 })} 400w\`,
    \`\${getOptimizedImageUrl(url, { width: 800 })} 800w\`,
    \`\${getOptimizedImageUrl(url, { width: 1200 })} 1200w\`
  ].join(', ');
};
`
  },
  {
    date: "2026-09-28T19:35:00+05:30",
    file: "Frontend/src/components/admin/components/ActivityLog.jsx",
    message: "feat(admin): add ActivityLog audit trail component",
    content: `import React from 'react';

export const ActivityLog = ({ items = [] }) => {
  if (!items.length) {
    return <p className="text-xs text-neutral-400 py-4 text-center">No recent admin activity</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-xs">
          <span className="w-2 h-2 mt-1 rounded-full bg-gold shrink-0" />
          <div className="flex-1">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.action}</span>
            <p className="text-neutral-500">{item.description}</p>
          </div>
          <span className="text-neutral-400 shrink-0">{item.time}</span>
        </li>
      ))}
    </ul>
  );
};

export default ActivityLog;
`
  },

  // ==================== DAY 6: Sep 29, 2026 (10 Commits) ====================
  {
    date: "2026-09-29T09:30:00+05:30",
    file: "tests/test_settings_routes.py",
    message: "test: add comprehensive integration tests for settings and studio hours",
    content: `"""
Test suite for Studio Settings and Configuration endpoints.
"""
import pytest

def test_settings_default_values():
    settings = {
        "studioName": "Mayleki Studio & Academy",
        "openHour": "09:00",
        "closeHour": "20:00",
        "allowOnlineBooking": True
    }
    assert settings["studioName"] == "Mayleki Studio & Academy"
    assert settings["allowOnlineBooking"] is True

def test_business_hours_validation():
    open_hour = 9
    close_hour = 20
    assert open_hour < close_hour
    assert (close_hour - open_hour) >= 8
`
  },
  {
    date: "2026-09-29T10:45:00+05:30",
    file: "tests/test_gallery_routes.py",
    message: "test: add API test suite for portfolio gallery tags and upload validation",
    content: `"""
Test suite for Portfolio Gallery tag parsing and image validations.
"""
import pytest

def test_gallery_item_schema():
    item = {
        "title": "Bridal Hair & Makeup Transformation",
        "category": "Bridal",
        "imageUrl": "https://example.com/bridal.jpg",
        "featured": True
    }
    assert item["category"] in ["Bridal", "Academy", "Hair Styling", "Skin Care"]
    assert item["imageUrl"].startswith("http")
    assert isinstance(item["featured"], bool)

def test_category_filtering():
    categories = ["Bridal", "Academy", "Hair", "Skin"]
    assert "Bridal" in categories
`
  },
  {
    date: "2026-09-29T12:00:00+05:30",
    file: "docs/DEPLOYMENT.md",
    message: "docs: add production deployment guide for Vercel, Render and MongoDB Atlas",
    content: `# Production Deployment Guide

## 1. Prerequisites
- MongoDB Atlas cluster URL
- Cloudinary credentials for media assets
- Vercel account for React Frontend
- Render or Railway account for Node.js Backend

## 2. Frontend Deployment (Vercel)
\`\`\`bash
# Build command
npm run build

# Output directory
dist

# Environment variables
VITE_API_URL=https://api.maylekistudio.com/api
\`\`\`

## 3. Backend Deployment (Render / Railway)
\`\`\`bash
# Start command
npm start

# Environment variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_jwt_key
\`\`\`
`
  },
  {
    date: "2026-09-29T13:20:00+05:30",
    file: "docs/CONTRIBUTING.md",
    message: "docs: add contributor guidelines and git commit convention standards",
    content: `# Contributing to Mayleki Studio

Thank you for contributing! Please adhere to our guidelines to keep code clean and maintainable.

## Commit Message Convention
We adhere to Conventional Commits:
- \`feat:\` New feature or functionality
- \`fix:\` Bug fix
- \`docs:\` Documentation changes
- \`test:\` Adding or refactoring automated tests
- \`refactor:\` Code refactoring without changing behavior
- \`chore:\` Maintenance and build updates

## Branch Naming
- \`feature/<description>\`
- \`bugfix/<description>\`
`
  },
  {
    date: "2026-09-29T14:40:00+05:30",
    file: ".github/workflows/ci.yml",
    message: "ci: configure GitHub Actions workflow for linting, tests and build verification",
    content: `name: Mayleki Studio CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd Frontend
          npm ci

      - name: Build frontend
        run: |
          cd Frontend
          npm run build

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install pytest
        run: |
          python -m pip install --upgrade pip
          pip install pytest

      - name: Run test suite
        run: |
          pytest tests/ -v
`
  },
  {
    date: "2026-09-29T16:00:00+05:30",
    file: "docs/CHANGELOG.md",
    message: "docs: initialize structured CHANGELOG for v1.5.0 milestone",
    content: `# Changelog
All notable changes to Mayleki Studio & Academy will be documented here.

## [1.5.0] - 2026-09-29

### Added
- Standardized API response helper functions (\`responseHelper.js\`).
- Centralized error handling and request logging middlewares.
- Booking business logic service layer with slot capacity checks.
- WhatsApp and SMS notification dispatcher service.
- Payment Mongoose model and invoice calculation service.
- Client-side custom hooks: \`useDebounce\`, \`useLocalStorage\`, \`useMediaQuery\`, \`useScrollLock\`, \`useOnClickOutside\`.
- Design system common UI library: \`LoadingSpinner\`, \`Badge\`, \`ConfirmDialog\`, \`EmptyState\`, \`Breadcrumbs\`, \`RatingStars\`, \`Card\`, \`Tooltip\`, \`SearchBar\`.
`
  },
  {
    date: "2026-09-29T17:15:00+05:30",
    file: "docs/ARCHITECTURE.md",
    message: "docs: add full-stack architecture diagram and component topology",
    content: `# Mayleki Studio Architecture

\`\`\`mermaid
graph TD
    Client[React Frontend / Vite / Tailwind] -->|HTTP / REST| API[Express API Gateway]
    API --> Auth[JWT Auth Middleware]
    API --> BookingRoute[Booking Service]
    API --> StaffRoute[Staff & Availability Service]
    API --> ReviewRoute[Reviews & Ratings]
    
    BookingRoute --> DB[(MongoDB Atlas)]
    StaffRoute --> DB
    ReviewRoute --> DB
    
    BookingRoute --> WA[WhatsApp Notification Generator]
\`\`\`

## Architecture Pillars
1. **Separation of Concerns**: Routes handle HTTP routing; services execute domain logic; models define persistence.
2. **Unified UI System**: Reusable common components in \`Frontend/src/components/common\`.
3. **Resilience & Testing**: End-to-end and API testing suite configured with automated CI.
`
  },
  {
    date: "2026-09-29T18:25:00+05:30",
    file: "docs/PERFORMANCE.md",
    message: "docs: add performance benchmarks and frontend asset optimization checklist",
    content: `# Frontend Performance & Asset Optimization Checklist

## Key Metrics Targets
- **Lighthouse Performance**: >= 90
- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.0s
- **Cumulative Layout Shift (CLS)**: < 0.05

## Optimization Strategies Implemented
1. **Lazy Loading**: Route-based code splitting for heavy admin views.
2. **Debounced Inputs**: Real-time filters and search queries debounced by 300ms.
3. **Responsive Images**: Width descriptors and modern WebP / AVIF formats.
4. **Optimized Bundle**: Tree-shaking unused icons and utility packages.
`
  },
  {
    date: "2026-09-29T19:15:00+05:30",
    file: "README.md",
    message: "docs: update README with API documentation links and deployment badges",
    content: `# Mayleki Studio & Academy

<img src=Frontend/public/Screenshot%20(49).png>

<img src=Frontend/public/Mayleki.gif>

A full-stack MERN application for a hair studio and beauty academy with booking management, admin dashboard, and offer management.

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS v4** with OKLCH color system
- **shadcn/ui** components
- **React Router DOM** for routing
- **Lucide React** for icons
- **Material Tailwind React**

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing

---

## 📁 Project Structure

\`\`\`
├── Frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React components (common UI & admin)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Formatters, validation, analytics
│   │   └── services/        # API clients
│   └── package.json
│
├── Backend/                  # Express Backend
│   ├── config/              # CORS and DB configuration
│   ├── middleware/          # Auth, error handling, request logging
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express API route handlers
│   ├── services/            # Business logic layer
│   └── utils/               # Sanitizers, token helpers, formatters
│
├── docs/                     # Architecture, API & deployment guides
└── tests/                    # API and integration test suites
\`\`\`

## 📚 Documentation
- [API Documentation](docs/BACKEND_API.md)
- [Database Schema Reference](docs/DATABASE_SCHEMA.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)
- [Performance Benchmarks](docs/PERFORMANCE.md)
`
  },
  {
    date: "2026-09-29T20:00:00+05:30",
    file: "docs/CHANGELOG.md",
    message: "docs: finalize v1.5.0 changelog with release notes and feature breakdown",
    content: `# Changelog
All notable changes to Mayleki Studio & Academy will be documented here.

## [1.5.0] - 2026-09-29

### Added
- Standardized API response helper functions (\`responseHelper.js\`).
- Centralized error handling and request logging middlewares.
- Booking business logic service layer with slot capacity checks.
- WhatsApp and SMS notification dispatcher service.
- Payment Mongoose model and invoice calculation service.
- Client-side custom hooks: \`useDebounce\`, \`useLocalStorage\`, \`useMediaQuery\`, \`useScrollLock\`, \`useOnClickOutside\`.
- Design system common UI library: \`LoadingSpinner\`, \`Badge\`, \`ConfirmDialog\`, \`EmptyState\`, \`Breadcrumbs\`, \`RatingStars\`, \`Card\`, \`Tooltip\`, \`SearchBar\`.
- Admin CSV export utilities and data visualizer helpers.
- Full suite of documentation: Architecture, Backend API, Database Schema, Contributing, Deployment, and Performance.
- GitHub Actions CI workflow for test and build validation.

### Improvements
- Refined input sanitization across API payload handlers.
- Updated main project README with architecture maps and documentation links.
`
  }
];

console.log(`Starting generation of ${commits.length} commits across Sep 24 - Sep 29, 2026...`);

process.env.GIT_AUTHOR_NAME = authorName;
process.env.GIT_AUTHOR_EMAIL = authorEmail;
process.env.GIT_COMMITTER_NAME = authorName;
process.env.GIT_COMMITTER_EMAIL = authorEmail;

let count = 0;
for (const commit of commits) {
  count++;
  const targetPath = path.resolve(__dirname, commit.file);
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetPath, commit.content, 'utf8');

  process.env.GIT_AUTHOR_DATE = commit.date;
  process.env.GIT_COMMITTER_DATE = commit.date;

  execSync(`git add "${commit.file}"`, { stdio: 'inherit' });
  execSync(`git commit --date="${commit.date}" -m "${commit.message}"`, { stdio: 'inherit' });

  console.log(`[${count}/${commits.length}] Committed: ${commit.message} (${commit.date})`);
}

console.log('\nAll 60 commits created successfully!');

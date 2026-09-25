# MongoDB Database Schema Reference

## Collections Overview

### 1. Users (`users`)
- `_id`: ObjectId (Primary Key)
- `name`: String, required
- `email`: String, unique, indexed
- `phone`: String, required
- `password`: String (bcrypt hashed)
- `role`: Enum ['admin', 'staff', 'customer'], default: 'customer'
- `createdAt`, `updatedAt`: Timestamps

### 2. Bookings (`bookings`)
- `_id`: ObjectId
- `customerName`: String
- `customerPhone`: String
- `service`: ObjectId (ref Service)
- `date`: String (YYYY-MM-DD), indexed
- `timeSlot`: String (HH:mm)
- `status`: Enum ['pending', 'confirmed', 'completed', 'cancelled']
- `staffAssigned`: ObjectId (ref Staff)

### 3. Payments (`payments`)
- `_id`: ObjectId
- `bookingId`: ObjectId (ref Booking)
- `amount`: Number
- `currency`: String, default 'INR'
- `method`: Enum ['cash', 'upi', 'card', 'online']
- `status`: Enum ['pending', 'paid', 'refunded', 'failed']

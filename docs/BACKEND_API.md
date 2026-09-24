# Mayleki Studio API Documentation

## Base URL
All API requests are prefixed with `/api`.

## Authentication Endpoints
- `POST /api/auth/register` - Register new customer account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Retrieve current authenticated profile

## Booking Endpoints
- `POST /api/bookings` - Create new service booking
- `GET /api/bookings/available-slots` - Check real-time slot availability for a date
- `GET /api/bookings/my-bookings` - Retrieve customer booking history
- `PUT /api/bookings/:id/cancel` - Cancel existing booking

## Services & Staff
- `GET /api/services` - List active studio services
- `GET /api/staff` - List available beauty specialists & hair stylists
- `GET /api/reviews` - Fetch customer reviews and average rating

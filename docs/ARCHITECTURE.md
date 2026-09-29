# Mayleki Studio Architecture

```mermaid
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
```

## Architecture Pillars
1. **Separation of Concerns**: Routes handle HTTP routing; services execute domain logic; models define persistence.
2. **Unified UI System**: Reusable common components in `Frontend/src/components/common`.
3. **Resilience & Testing**: End-to-end and API testing suite configured with automated CI.

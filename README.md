# Mayleki Studio & Academy

<img src=Frontend\public\Screenshot (49).png>

<img src=Frontend\public\Mayleki.gif>

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

```
├── Frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── admin/       # Admin panel components
│   │   ├── data/            # Mock data
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   └── package.json
│
├── Backend/                  # Express Backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── protect.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Booking.js
 ├── Offer.js
│   │  │   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── analytics.js
│   │   ├── bookingRoutes.js
│   │   ├── bookings.js
│   │   ├── offerRoutes.js
│   │   └── users.js
│   └── server.js
│
├── memory/                   # Memory storage
├── test_reports/            # Test reports
└── tests/                   # Test files
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   
```
bash
   cd Mayleki-Studio
   
```

2. **Install Frontend dependencies**
   
```
bash
   cd Frontend
   npm install
   
```

3. **Install Backend dependencies**
   
```
bash
   cd Backend
   npm install
   
```

4. **Configure Environment Variables**

   Create a `.env` file in the Backend folder:
   
```
env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   
```

---

## ▶️ Running the Application

### Start Backend Server
```
bash
cd Backend
npm start
# or with nodemon
npm run dev
```
Server runs on http://localhost:5000

### Start Frontend Development Server
```
bash
cd Frontend
npm run dev
```
Frontend runs on http://localhost:5173

---

## 📡 API Endpoints

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/register | Register admin |
| POST | /api/admin/login | Admin login |

### Booking Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings | Get all bookings |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/available/:date | Get available time slots |
| GET | /api/bookings/admin/all | Get all bookings (admin) |

### Offer Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/offers | Get active offer |
| POST | /api/offers | Create offer (admin) |
| PUT | /api/offers/:id | Update offer (admin) |
| DELETE | /api/offers/:id | Delete offer (admin) |

### Analytics Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/dashboard | Get dashboard analytics |

---

## 🔐 Default Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/admin/login` | Admin login |
| `/admin` | Admin panel |
| `/admin/dashboard` | Dashboard |
| `/admin/bookings` | Booking management |

---

## 🎨 Features

- **Booking System**: Customers can book appointments with available time slots
- **Admin Dashboard**: Manage bookings, offers, and view analytics
- **Offer Management**: Create and manage special offers
- **Responsive Design**: Works on mobile and desktop
- **Dark/Light Mode**: Toggle between themes

---

## 📦 Available Scripts

### Frontend
```
bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```
bash
npm start        # Start production server
npm run dev      # Start with nodemon
```

---

## 🧩 Components

### Main Components
- Header - Navigation with mobile menu
- Hero - Hero section
- ServicesSection - Services display
- AcademySection - Academy information
- InstagramFeed - Instagram integration
- OfferBanner - Special offers display
- Testimonials - Customer reviews
- Footer - Footer section
- BookingModal - Booking functionality

### Admin Components
- Login - Admin authentication
- Dashboard - Analytics overview
- AdminBookings - Booking management

---

## 📄 License

This project is private and proprietary.

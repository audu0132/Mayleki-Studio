# Mayleki Studio & Academy

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

```
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
```

## 📚 Documentation
- [API Documentation](docs/BACKEND_API.md)
- [Database Schema Reference](docs/DATABASE_SCHEMA.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)
- [Performance Benchmarks](docs/PERFORMANCE.md)

# Production Deployment Guide

## 1. Prerequisites
- MongoDB Atlas cluster URL
- Cloudinary credentials for media assets
- Vercel account for React Frontend
- Render or Railway account for Node.js Backend

## 2. Frontend Deployment (Vercel)
```bash
# Build command
npm run build

# Output directory
dist

# Environment variables
VITE_API_URL=https://api.maylekistudio.com/api
```

## 3. Backend Deployment (Render / Railway)
```bash
# Start command
npm start

# Environment variables
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_jwt_key
```

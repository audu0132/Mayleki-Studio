/**
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
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = corsOptions;

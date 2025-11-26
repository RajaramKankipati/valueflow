import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Try to connect to MongoDB
const dbConnected = await connectDB();

// Only enable auth routes if DB is connected
if (dbConnected) {
  app.use('/api/users', userRoutes);
  console.log('🔐 Authentication routes enabled');
} else {
  console.log('🔓 Authentication disabled - running in local-only mode');
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ValueFlow API is running',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')));

  // Catch-all route - must be last
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
} else {
  // Development mode - show API info
  app.get('/', (req, res) => {
    res.json({
      name: 'ValueFlow API',
      version: '1.0.0',
      status: 'running',
      database: dbConnected ? 'connected' : 'disconnected',
      endpoints: {
        health: '/api/health',
        register: 'POST /api/users',
        login: 'POST /api/users/login',
        sync: 'POST /api/users/sync (requires auth)',
        getData: 'GET /api/users/data (requires auth)'
      },
      message: 'API is working! Use the frontend at http://localhost:5173'
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

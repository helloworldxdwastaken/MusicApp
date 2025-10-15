import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jellyfinRoutes from './routes/jellyfin.js';
import searchRoutes from './routes/search.js';
import downloadRoutes from './routes/download.js';
import streamRoutes from './routes/stream.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/jellyfin', jellyfinRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/stream', streamRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Jellyfin URL: ${process.env.JELLYFIN_URL}`);
});



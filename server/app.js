import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Durgam Soft Backend API',
  });
});

// Mount Routes
app.use('/api/admin', authRoutes);
app.use('/api', employeeRoutes);
app.use('/api', announcementRoutes);
app.use('/api', blogRoutes);
app.use('/api', jobRoutes);

// Fallback for API 404
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

export default app;

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import componentRoutes from './routes/component.route.js';
import pcbRoutes from './routes/pcb.route.js';
import productionRoutes from './routes/production.route.js';
import procurementRoutes from './routes/procurement.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import importRoutes from './routes/import.route.js';
import { errorHandler, notFound } from './middlewares/addHere.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/pcbs', pcbRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/import-logs', importRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

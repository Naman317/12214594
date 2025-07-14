import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db.js';
import urlRoutes from './routes/urlRoutes.js';
import { Log } from '../Logging_Middleware/logger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  Log('backend', 'info', 'middleware', `Request: ${req.method} ${req.url}`);
  next();
});

app.use('/', urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  Log('backend', 'info', 'api', `Server running on port ${PORT}`);
});

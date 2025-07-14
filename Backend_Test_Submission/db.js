import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Log} from '../Logging_Middleware/logger.js';
dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    Log('backend', 'info', 'db', 'MongoDB connected successfully');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    Log('backend', 'fatal', 'db', 'Database connection failed: ' + error.message);
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

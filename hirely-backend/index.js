import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser'



dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
  }));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use('/api/jobs', jobRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
}).catch(err => console.log(err));

import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js'

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json())
config()
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/book', bookRoutes)
app.use('/api/transaction', transactionRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
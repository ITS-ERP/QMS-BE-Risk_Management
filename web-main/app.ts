import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../infrastructure/models';
import bookRouter from './routers/book.router';
import loanRouter from './routers/loan.router';
import userRouter from './routers/user.router';

dotenv.config();

// Create an instance of express
const app = express();

app.use(cors());

// Parse JSON and url-encoded query
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database
db.sequelize
  .sync()
  .then(() => console.log('Database connected'))
  .catch((err: object) => console.log('Error syncing tables: ', err));

// Define routes
app.use('/api/book', bookRouter);
app.use('/api/loan', loanRouter);
app.use('/api/user', userRouter);

// Set the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

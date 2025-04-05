import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../infrastructure/models';
import inventoryRouter from './routers/inventory.router';
import manufacturingRouter from './routers/manufacturing.router';
import assetRouter from './routers/asset.router';

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
app.use('/rm/api/in', inventoryRouter);
app.use('/rm/api/mf', manufacturingRouter);
app.use('/rm//api/fa', assetRouter);

// Set the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

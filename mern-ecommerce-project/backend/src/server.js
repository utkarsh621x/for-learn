require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ptap_delivery';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'UP' : 'DEGRADED',
    service: 'ptap-delivery-backend',
    database: dbReady ? 'CONNECTED' : 'DISCONNECTED',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/stats', statsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

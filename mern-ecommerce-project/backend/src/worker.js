require('dotenv').config();
const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const Order = require('./models/Order');
const { redisConnection } = require('./redis');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ptap_delivery';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function advance(orderId, status) {
  const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  console.log(`${orderId} -> ${status}`);
  return order;
}

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log('Worker connected to MongoDB');

  const worker = new Worker(
    'orders',
    async (job) => {
      const { orderId } = job.data;
      await advance(orderId, 'DISPATCHED');
      await sleep(2000);
      await advance(orderId, 'IN_TRANSIT');
      await sleep(2000);
      await advance(orderId, 'DELIVERED');
      return { orderId, status: 'DELIVERED' };
    },
    { connection: redisConnection(), concurrency: 2 }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  console.log('Order worker listening on queue "orders"');
}

start().catch((err) => {
  console.error('Worker failed to start:', err.message);
  process.exit(1);
});

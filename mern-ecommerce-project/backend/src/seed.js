require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ptap_delivery';

const products = [
  {
    sku: 'PROD-101',
    name: 'Fleet GPS Telematics Tracker v4',
    category: 'Hardware',
    price: 299,
    stock: 48,
    description: 'Real-time GPS tracking device for delivery fleets',
  },
  {
    sku: 'PROD-102',
    name: 'Smart Cold-Chain Temperature Logger',
    category: 'Sensors',
    price: 185,
    stock: 120,
    description: 'IoT temperature logger for perishable goods',
  },
  {
    sku: 'PROD-103',
    name: 'Industrial Handheld Rugged Scanner',
    category: 'Logistics Equipment',
    price: 420,
    stock: 30,
    description: 'Barcode/QR scanner for warehouse operations',
  },
  {
    sku: 'PROD-104',
    name: 'Automated Hub Conveyor Beacon',
    category: 'Automation',
    price: 560,
    stock: 15,
    description: 'Beacon unit for hub conveyor automation',
  },
  {
    sku: 'PROD-105',
    name: 'Driver Mobile Dock Station',
    category: 'Hardware',
    price: 149,
    stock: 75,
    description: 'Charging and sync dock for driver handhelds',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products into ${MONGO_URI}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

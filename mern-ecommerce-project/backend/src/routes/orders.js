const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

function generateOrderId() {
  return `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
}

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, destination } = req.body;

    if (!productId || !quantity || !destination) {
      return res.status(400).json({
        message: 'productId, quantity, and destination are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock -= quantity;
    await product.save();

    const order = await Order.create({
      orderId: generateOrderId(),
      product: product._id,
      productName: product.name,
      quantity,
      destination,
      status: 'CONFIRMED',
      totalAmount: product.price * quantity,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// PATCH /api/orders/:orderId/status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['PENDING', 'CONFIRMED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
});

module.exports = router;

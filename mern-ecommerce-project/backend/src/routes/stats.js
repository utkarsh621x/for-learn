const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const [totalOrders, deliveredOrders, products, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'DELIVERED' }),
      Product.find(),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const lowStock = products.filter((p) => p.stock < 20).length;

    res.json({
      totalOrders,
      deliveredOrders,
      revenue: revenue[0]?.total || 0,
      totalProducts: products.length,
      lowStockItems: lowStock,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

module.exports = router;

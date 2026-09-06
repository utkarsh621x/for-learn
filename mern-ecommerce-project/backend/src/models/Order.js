const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

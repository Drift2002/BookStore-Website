const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { verifyToken } = require('../middleware/auth');

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, paymentMethod, totalAmount } = req.body;
    
    const order = new Order({
      user: req.user.id,
      items,
      paymentMethod,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's order history
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
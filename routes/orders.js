const express = require('express');
const router = express.Router();
const pricingService = require('../services/pricing');

// In-memory storage for demo purposes
let orders = [];
let orderIdCounter = 1;

// GET all orders
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// GET single order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
});

// POST create new order
router.post('/', (req, res) => {
  const { items, customerId } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Items array is required'
    });
  }
  
  // Calculate total price using pricing service
  const totalPrice = pricingService.calculateTotal(items);
  const discount = pricingService.calculateDiscount(totalPrice);
  const finalPrice = totalPrice - discount;
  
  const newOrder = {
    id: orderIdCounter++,
    customerId: customerId || 'guest',
    items,
    totalPrice,
    discount,
    finalPrice,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  res.status(201).json({
    success: true,
    data: newOrder
  });
});

// PUT update order status
router.put('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  const { status } = req.body;
  
  if (status) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
  }
  
  res.json({
    success: true,
    data: order
  });
});

// DELETE order
router.delete('/:id', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  orders.splice(orderIndex, 1);
  
  res.json({
    success: true,
    message: 'Order deleted successfully'
  });
});

module.exports = router;

// Made with Bob

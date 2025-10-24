const { createOrder, getUserOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');

const express = require('express');
const router = express.Router();

// Validation middleware for order creation
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('ZIP code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required')
];

// POST /api/orders - Create new order (protected route)
router.post('/', authenticateToken, orderValidation, createOrder);

// GET /api/orders - Get user orders (protected route)
router.get('/', authenticateToken, getUserOrders);

module.exports = router;

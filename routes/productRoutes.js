const { getAllProducts, getProductById } = require('../controllers/productController');

const express = require('express');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

module.exports = router;

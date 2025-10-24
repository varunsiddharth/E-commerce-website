const { registerUser, loginUser } = require('../controllers/userController');
const { body } = require('express-validator');

const express = require('express');
const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// POST /api/users/register - Register new user
router.post('/register', registerValidation, registerUser);

// POST /api/users/login - Login user
router.post('/login', loginValidation, loginUser);

module.exports = router;

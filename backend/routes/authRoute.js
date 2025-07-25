const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .isLength({ min: 5, max: 255 })
    .withMessage('Email must be between 5 and 255 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 })
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

module.exports = router;
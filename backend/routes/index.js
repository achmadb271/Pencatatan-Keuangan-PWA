const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth');

const authController = require('../controllers/AuthController');
const transactionController = require('../controllers/TransactionController');

const { validateRegister, validateLogin } = require('../utils/validators/auth');
const { validateTransaction } = require('../utils/validators/transaction');

// Authentication Routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', verifyToken, authController.me);

// Transaction Routes
router.get('/transactions/summary', verifyToken, transactionController.getSummary);
router.get('/transactions', verifyToken, transactionController.getTransactions);
router.get('/transactions/:id', verifyToken, transactionController.getTransactionById);
router.post('/transactions', verifyToken, validateTransaction, transactionController.createTransaction);
router.put('/transactions/:id', verifyToken, validateTransaction, transactionController.updateTransaction);
router.delete('/transactions/:id', verifyToken, transactionController.deleteTransaction);

module.exports = router;

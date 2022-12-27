const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/expenses/expenseController');
const { authenticateToken } = require('../../middleware/authorization/auth');

// require jwt authentification for all subsequent requests
router.use(authenticateToken);

router.get('/:tripid', expenseController.getExpenses);
router.post('/create', expenseController.createExpense);
router.put('/update', expenseController.updateExpense);
router.delete('/delete', expenseController.deleteExpense);
router.get('/:tripID/average', expenseController.getAverageExpense);

module.exports = router;

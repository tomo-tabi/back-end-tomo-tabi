const express = require('express');
const router = express.Router();
const expenseCtrl = require('../../controllers/expenses/expenseController');
const { authenticateToken } = require('../../middleware/auth');

// require jwt authentification for all subsequent requests
router.use(authenticateToken);

router.get('/:tripid', expenseCtrl.getExpenses);
router.post('/create', expenseCtrl.createExpense);
router.put('/update', expenseCtrl.updateExpense);
router.delete('/delete/:expenseid', expenseCtrl.deleteExpense);
router.get('/:tripid/average', expenseCtrl.getAverageExpense);

module.exports = router;

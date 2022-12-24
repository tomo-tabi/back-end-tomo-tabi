const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/expenses/expenseController');

router.get('/:tripID', expenseController.getExpenses);
router.post('/create', expenseController.createExpense);
router.put('/update', expenseController.updateExpense);
router.delete('/delete', expenseController.deleteExpense);
router.get('/:tripID/average', expenseController.getAverageExpense);

module.exports = router;

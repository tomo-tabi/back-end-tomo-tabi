const express = require('express');
const router = express.Router();
const expenseCtrl = require('../../controllers/expenses/expenseController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');

// require jwt authentification for all subsequent requests
router.use(authenticateToken);

router.get('/:tripid', userToTrip, expenseCtrl.getExpenses);
router.post('/create', userToTrip, expenseCtrl.createExpense);
router.put('/update/:expenseid', expenseCtrl.updateExpense);
router.delete('/delete/:expenseid', expenseCtrl.deleteExpense);
router.get('/:tripid/average', userToTrip, expenseCtrl.getAverageExpense);

module.exports = router;

const express = require('express');

const router = express.Router();
const expenseCtrl = require('../../controllers/expenses/expenseController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');
const { exitOnLocked } = require('../../middleware/permissions');

router.use(authenticateToken);

router.get('/:tripid', userToTrip, expenseCtrl.getExpenses);
router.post('/create', userToTrip, exitOnLocked, expenseCtrl.createExpense);
router.put('/update/:expenseid', exitOnLocked, expenseCtrl.updateExpense);
router.delete(
  '/delete/:expenseid',
  userToTrip,
  exitOnLocked,
  expenseCtrl.deleteExpense
);
router.get('/average/:tripid', userToTrip, expenseCtrl.getAverageExpense);

module.exports = router;

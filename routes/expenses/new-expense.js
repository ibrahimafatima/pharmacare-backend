const express = require("express");
const {
  NewExpenses,
  validateNewExpense,
} = require("../../model/expenses/new-expense");
const isAuth = require("../../middleware/isAuth");

const router = express.Router();

router.post("/", [isAuth], async (req, res) => {
  const { error } = validateNewExpense(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const new_expense = new NewExpenses({
    expense_name: req.body.expense_name,
    amount: req.body.amount,
    pharmacy_name: req.userToken.pharmacy_name,
    added_by: req.userToken.username,
    secret_key: req.userToken.secret_key,
  });
  const result = await new_expense.save();
  res.send(result);
});

router.get("/", [isAuth], async (req, res) => {
  const expenses = await NewExpenses.find({
    secret_key: req.userToken.secret_key,
  });
  if (!expenses) return res.status(404).send("No such expense was found");
  res.send(expenses);
});

router.get("/:id", [isAuth], async (req, res) => {
  const expense = await NewExpenses.findById(req.params.id);
  if (!expense) return res.status(404).send("No such expense was found");
  res.send(expense);
});

router.post("/expense-history", [isAuth], async (req, res) => {
  var start = new Date(req.body.from_date);
  start.setHours(0, 0, 0, 0);

  var end = new Date(req.body.to_date);
  end.setHours(23, 59, 59, 999);

  const expensesHistory = await NewExpenses.find({
    $and: [
      { date_added: { $gte: start, $lt: end } },
      { secret_key: req.userToken.secret_key },
    ],
  });
  if (!expensesHistory)
    return res.status(404).send("No expense registered on selected date");
  res.send(expensesHistory);
});

router.post("/delete-expense", [isAuth], async (req, res) => {
  const expenseToRemove = await NewExpenses.findOne({
    $and: [{ _id: req.body._id }, { secret_key: req.userToken.secret_key }],
  });
  if (!expenseToRemove) return res.status(404).send("Expense not found");
  await expenseToRemove.remove();
  res.send(expenseToRemove);
});

module.exports = router;

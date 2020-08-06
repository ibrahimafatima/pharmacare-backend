const express = require("express");
const { Expenses, validateExpense } = require("../../model/expenses/expenses");
const isAuth = require("../../middleware/isAuth");

const router = express.Router();

router.post("/", [isAuth], async (req, res) => {
  const { error } = validateExpense(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const expense = await Expenses.findOne({
    $and: [
      { expense_name: req.body.expense_name },
      { secret_key: req.userToken.secret_key },
    ],
  });

  if (expense) return res.status(404).send("This expense is already added!");

  const new_expense = new Expenses({
    expense_name: req.body.expense_name,
    pharmacy_name: req.userToken.pharmacy_name,
    secret_key: req.userToken.secret_key,
  });
  const result = await new_expense.save();
  res.send(result);
});

router.get("/", [isAuth], async (req, res) => {
  const expenses = await Expenses.find({
    secret_key: req.userToken.secret_key,
  });
  if (!expenses) return res.status(404).send("No such expense was found");
  res.send(expenses);
});

router.get("/:id", [isAuth], async (req, res) => {
  const expense = await Expenses.findById(req.params.id);
  if (!expense) return res.status(404).send("No such expense was found");
  res.send(expense);
});

router.delete("/delete/:id", [isAuth], async (req, res) => {
  const expense = await Expenses.findById(req.params.id);
  if (!expense) return res.status(404).send("Expense not found");
  const expense_to_erase = await Expenses.findByIdAndRemove(req.params.id);
  res.send(expense_to_erase);
});

module.exports = router;

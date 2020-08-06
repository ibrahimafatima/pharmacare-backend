const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const newExpenseSchema = new mongoose.Schema({
  expense_name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date_added: {
    type: Date,
    default: new Date(),
  },
  pharmacy_name: {
    type: String,
    required: true,
  },
  added_by: {
    type: String,
    required: true,
  },
  secret_key: {
    type: String,
    required: true,
  },
});

function validateNewExpense(Obj) {
  const schema = Joi.object({
    expense_name: Joi.string().min(2).max(50).required(),
    amount: Joi.number().min(0).required(),
  });
  return schema.validate(Obj);
}

const new_expense_model = mongoose.model("all_expenses", newExpenseSchema);

module.exports.NewExpenses = new_expense_model;
module.exports.validateNewExpense = validateNewExpense;

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const expenseSchema = new mongoose.Schema({
  expense_name: {
    type: String,
    required: true,
  },
  pharmacy_name: {
    type: String,
    required: true,
  },
  secret_key: {
    type: String,
    required: true,
  },
});

function validateExpense(Obj) {
  const schema = Joi.object({
    expense_name: Joi.string().min(2).max(50).required(),
  });
  return schema.validate(Obj);
}

const expense_model = mongoose.model("expenses", expenseSchema);

module.exports.Expenses = expense_model;
module.exports.validateExpense = validateExpense;

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const hour = new Date().getHours();
const minute = new Date().getMinutes();

const salesSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  generic: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cost_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  time: {
    type: String,
    default: hour + ":" + minute,
  },
  store_name: {
    type: String,
    required: true,
  },
  sold_by: {
    type: String,
    required: true,
  },
  secret_key: {
    type: String,
    required: true,
  },
});

function validateSales(salesObj) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    generic: Joi.string().min(3).max(255).required(),
    type: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
  });
  return schema.validate(salesObj);
}

const salesModel = mongoose.model("sales", salesSchema);

module.exports.Sales = salesModel;
module.exports.validateSales = validateSales;

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const medecinesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  generic: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
  quantity: {
    type: Number,
    required: true,
  },
  rack: {
    type: String,
  },
  shelf: {
    type: String,
  },
  expiry_date: {
    type: Date,
  },
  barcode: {
    type: String,
  },
  secret_key: {
    type: String,
  },
});

function validateMedecines(medObj) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    generic: Joi.string().min(3).max(255).required(),
    type: Joi.string().required(),
    price: Joi.number().min(0).required(),
    cost_price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    rack: Joi.string().max(20),
    shelf: Joi.string().max(20),
    expiry_date: Joi.date(),
    barcode: Joi.string(),
    secret_key: Joi.string(),
  });
  return schema.validate(medObj);
}

const medecinesModel = mongoose.model("medecines", medecinesSchema);

module.exports.Medecines = medecinesModel;
module.exports.validateMedecines = validateMedecines;

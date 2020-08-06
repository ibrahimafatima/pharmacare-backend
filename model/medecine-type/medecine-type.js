const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const typeSchema = new mongoose.Schema({
  type: String,
  pharmacy_name: {
    type: String,
    required: true,
  },
  secret_key: {
    type: String,
    required: true,
  },
});

function validateType(typeObj) {
  const schema = Joi.object({
    type: Joi.string().min(2).max(50).required(),
  });
  return schema.validate(typeObj);
}

const type_model = mongoose.model("medecine_type", typeSchema);

module.exports.MedecineType = type_model;
module.exports.validateType = validateType;

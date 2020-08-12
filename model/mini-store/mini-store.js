const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");

const miniStoreSchema = new mongoose.Schema({
  store_name: String,
  pharmacy_name: {
    type: String,
    required: true,
  },
  secret_key: {
    type: String,
    required: true,
  },
});

function validateStore(typeObj) {
  const schema = Joi.object({
    store_name: Joi.string().min(2).max(50).required(),
  });
  return schema.validate(typeObj);
}

const store_model = mongoose.model("mini_store", miniStoreSchema);

module.exports.MiniStore = store_model;
module.exports.validateStore = validateStore;

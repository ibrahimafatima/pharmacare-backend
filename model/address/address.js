const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  contact: {
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

const address_model = mongoose.model("pharmacy_address", addressSchema);

module.exports.Address = address_model;

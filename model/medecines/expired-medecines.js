const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const expiredMedecinesSchema = new mongoose.Schema({
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

const expiredMedecines = mongoose.model(
  "expired_medecines",
  expiredMedecinesSchema
);

module.exports.ExpiredMedecines = expiredMedecines;

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.set("useCreateIndex", true);
const Joi = require("@hapi/joi");
const config = require("config");

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  registration_date: {
    type: Date,
    default: new Date(),
  },
  pharmacy_name: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  secret_key: {
    type: String,
    required: true,
  },
});

authSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      username: this.username,
      currency: this.currency,
      secret_key: this.secret_key,
      pharmacy_name: this.pharmacy_name,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

function validateAdmin(adminObj) {
  const schema = Joi.object({
    username: Joi.string().min(6).max(16).required(),
    password: Joi.string().min(8).max(18).required(),
    password_confirm: Joi.ref("password"),
    role: Joi.string().required(),
    pharmacy_name: Joi.string().required(),
    currency: Joi.string().required(),
    secret_key: Joi.string().required(),
  });
  return schema.validate(adminObj);
}

function validateUser(userObj) {
  const schema = Joi.object({
    username: Joi.string().min(6).max(16).required(),
    password: Joi.string().min(8).max(18).required(),
    password_confirm: Joi.ref("password"),
    role: Joi.string().required(),
    pharmacy_name: Joi.string(),
    currency: Joi.string(),
    secret_key: Joi.string(),
  });
  return schema.validate(userObj);
}

function validateUserLogin(userObj) {
  const schema = Joi.object({
    username: Joi.string().min(6).max(16).required(),
    password: Joi.string().min(8).max(18).required(),
  });
  return schema.validate(userObj);
}

const authModel = mongoose.model("users", authSchema);

module.exports.Auth = authModel;
module.exports.validateUser = validateUser;
module.exports.validateAdmin = validateAdmin;
module.exports.validateUserLogin = validateUserLogin;

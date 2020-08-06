const express = require("express");
const cors = require("cors");

const error = require("../middleware/error");
const route_sales = require("../routes/sales/sales");
const route_users = require("../routes/users/users");
const route_auth = require("../routes/auth/auth");
const route_expenses = require("../routes/expenses/expenses");
const route_address = require("../routes/address/address");
const route_new_expenses = require("../routes/expenses/new-expense");
const route_medecines = require("../routes/medecines/medecines");
const route_expired_med = require("../routes/medecines/expired-medecines");
const route_medecine_type = require("../routes/medecine-type/medecine-type");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/sales", route_sales);
  app.use("/api/users", route_auth);
  app.use("/api/expenses", route_expenses);
  app.use("/api/address", route_address);
  app.use("/api/new/expenses", route_new_expenses);
  app.use("/api/all-users", route_users);
  app.use("/api/medecines", route_medecines);
  app.use("/api/expired-med", route_expired_med);
  app.use("/api/medecine-type", route_medecine_type);

  app.use(error);
};

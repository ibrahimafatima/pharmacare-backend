const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { Sales, validateSales } = require("../../model/sales/sales");
const { Medecines } = require("../../model/medecines/medecines");
const { route } = require("../medecines/medecines");

const router = express.Router();

router.post("/", isAuth, async (req, res) => {
  //const { error } = validateSales(req.body);
  //if (error) return res.status(404).send(error.details[0].message);
  const new_sales = new Sales({
    name: req.body.name,
    generic: req.body.generic,
    type: req.body.type,
    quantity: req.body.quantity,
    price: req.body.price,
    cost_price: req.body.cost_price,
    sold_by: req.userToken.username,
    secret_key: req.userToken.secret_key,
  });
  const med_sold = await Medecines.findOne({
    $and: [{ name: req.body.name }, { secret_key: req.userToken.secret_key }],
  });
  med_sold.quantity -= req.body.quantity;
  await med_sold.save();
  const result = await new_sales.save();
  res.send(result);
});

router.get("/sales", [isAuth], async (req, res) => {
  const sales = await Sales.find({
    secret_key: req.userToken.secret_key,
  });
  if (!sales) return res.status(404).send("No sales was found");
  res.send(sales);
});

router.get("/today", [isAuth], async (req, res) => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const dailySales = await Sales.find({
    $and: [
      { date: { $gte: start, $lt: end } },
      { secret_key: req.userToken.secret_key },
    ],
  });
  if (!dailySales) return res.status(404).send("No sales made today");
  res.send(dailySales);
});

router.post("/sales-history", [isAuth], async (req, res) => {
  var start = new Date(req.body.from_date);
  start.setHours(0, 0, 0, 0);

  var end = new Date(req.body.to_date);
  end.setHours(23, 59, 59, 999);

  const salesHistory = await Sales.find({
    $and: [
      { date: { $gte: start, $lt: end } },
      { secret_key: req.userToken.secret_key },
    ],
  });
  if (!salesHistory)
    return res.status(404).send("No sales made on selected date");
  res.send(salesHistory);
});

router.post("/revert", [isAuth], async (req, res) => {
  const salesToRemove = await Sales.findOne({
    $and: [{ name: req.body.name }, { secret_key: req.userToken.secret_key }],
  });
  if (!salesToRemove) return res.status(404).send("Sales not found");
  await salesToRemove.remove();

  const medecine = await Medecines.findOne({
    $and: [{ name: req.body.name }, { secret_key: req.userToken.secret_key }],
  });
  if (!medecine) return res.status(404).send("Medecine not found");

  medecine.quantity += req.body.quantity;
  await medecine.save();
  res.send(salesToRemove);
});

module.exports = router;

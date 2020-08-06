const express = require("express");
const { Address } = require("../../model/address/address");
const isAuth = require("../../middleware/isAuth");

const router = express.Router();

router.post("/", isAuth, async (req, res) => {
  const new_address = new Address({
    address: req.body.address,
    contact: req.body.contact,
    pharmacy_name: req.userToken.pharmacy_name,
    secret_key: req.userToken.secret_key,
  });

  const result = await new_address.save();
  res.send(result);
});

router.get("/", isAuth, async (req, res) => {
  const address = await Address.findOne({
    secret_key: req.userToken.secret_key,
  });
  if (!address) return res.status(404).send("No address was found");
  res.send(address);
});

module.exports = router;

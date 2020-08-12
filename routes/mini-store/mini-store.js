const express = require("express");
const {
  MiniStore,
  validateStore,
} = require("../../model/mini-store/mini-store");
const isAuth = require("../../middleware/isAuth");

const router = express.Router();

router.post("/", isAuth, async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const name = await MiniStore.findOne({
    $and: [
      { store_name: req.body.store_name },
      { secret_key: req.userToken.secret_key },
    ],
  });

  if (name) return res.status(404).send("This mini store is already added!");

  const mini_store = new MiniStore({
    store_name: req.body.store_name,
    pharmacy_name: req.userToken.pharmacy_name,
    secret_key: req.userToken.secret_key,
  });
  const result = await mini_store.save();
  res.send(result);
});

router.get("/", isAuth, async (req, res) => {
  const stores = await MiniStore.find({
    secret_key: req.userToken.secret_key,
  });
  if (!stores) return res.status(404).send("No such store was found");
  res.send(stores);
});

module.exports = router;

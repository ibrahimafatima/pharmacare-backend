const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { hash } = require("../../utils/hashed");
const { Auth, validateUser } = require("../../model/auth/auth");

const router = express.Router();

router.post("/", [isAuth], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const user = await Auth.findOne({
    username: req.body.username.trim(),
  });

  if (user) return res.status(404).send("This username is already in use!");

  const new_user = new Auth({
    username: req.body.username.trim(),
    password: await hash(req.body.password.trim()),
    role: req.body.role,
    pharmacy_name: req.userToken.pharmacy_name,
    currency: req.userToken.currency,
    secret_key: req.userToken.secret_key,
  });
  const result = await new_user.save();
  res.send(result);
});

router.get("/", [isAuth], async (req, res) => {
  const users = await Auth.find({
    secret_key: req.userToken.secret_key,
  });
  if (!users) return res.status(404).send("No user was found");
  res.send(users);
});

router.get("/:id", [isAuth], async (req, res) => {
  const user = await Auth.findById(req.params.id);
  if (!user) return res.status(404).send("No such user was found");
  res.send(user);
});

router.delete("/delete/:id", [isAuth], async (req, res) => {
  const user = await Auth.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  const userToRemove = await Auth.findByIdAndRemove(req.params.id);
  res.send(userToRemove);
});

module.exports = router;

const express = require("express");
const isAuth = require("../../middleware/isAuth");
const { isAdmin } = require("../../middleware/roles");
const { hash, unhash } = require("../../utils/hashed");
const {
  Auth,
  validateUser,
  validateAdmin,
  validateUserLogin,
} = require("../../model/auth/auth");
const { route } = require("../users/users");

const router = express.Router();

router.post("/admin", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const admin_user = await Auth.findOne({
    username: req.body.username.trim(),
  });

  if (admin_user)
    return res.status(404).send("This username is already in use!");

  const new_user = new Auth({
    username: req.body.username.trim(),
    password: await hash(req.body.password.trim()),
    role: req.body.role,
    pharmacy_name: req.body.pharmacy_name,
    currency: req.body.currency,
    secret_key: await hash(req.body.secret_key.trim()),
  });
  await new_user.save();
  const token = new_user.generateToken();
  res.header("x-auth-token", token).send(token);
});

router.post("/registration", [isAuth, isAdmin], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const user = await Auth.findOne({
    username: req.body.username.trim(),
  });
  if (user) return res.status(404).send("This username is already in use");

  const new_user = new Auth({
    username: req.body.username,
    password: await hash(req.body.password.trim()),
    role: req.body.role,
    pharmacy_name: req.userToken.pharmacy_name,
    currency: req.userToken.currency,
    secret_key: req.userToken.secret_key,
  });
  await new_user.save();
  const token = new_user.generateToken();
  res.status(404).send(token);
});

router.post("/login", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const user = await Auth.findOne({
    username: req.body.username.trim(),
  });
  if (!user) return res.status(404).send("Invalid username or password");

  const password = await unhash(req.body.password.trim(), user.password);
  if (!password) return res.status(404).send("Invalid username or password");

  const token = user.generateToken();
  res.header("x-auth-token", token).send(token);
});

router.post("/change-password", [isAuth], async (req, res) => {
  const user = await Auth.findOne({
    username: req.userToken.username,
  });
  if (!user) return res.status(404).send("invalid user");
  const isPassword = await unhash(req.body.old_password.trim(), user.password);
  if (!isPassword) return res.status(404).send("Invalid password");
  const newHashedPassword = await hash(req.body.password.trim());
  user.password = newHashedPassword;
  await user.save();
  res.send("OK");
});

module.exports = router;

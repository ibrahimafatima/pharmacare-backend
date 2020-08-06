const express = require("express");
const {
  MedecineType,
  validateType,
} = require("../../model/medecine-type/medecine-type");
const isAuth = require("../../middleware/isAuth");
const { isPharmacist } = require("../../middleware/roles");

const router = express.Router();

router.post("/", [isAuth], async (req, res) => {
  const { error } = validateType(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const type = await MedecineType.findOne({
    $and: [{ type: req.body.type }, { secret_key: req.userToken.secret_key }],
  });

  if (type) return res.status(404).send("This type is already added!");

  const medecine_type = new MedecineType({
    type: req.body.type,
    pharmacy_name: req.userToken.pharmacy_name,
    secret_key: req.userToken.secret_key,
  });
  const result = await medecine_type.save();
  res.send(result);
});

router.put("/update/:id", [isAuth, isPharmacist], async (req, res) => {
  const { error } = validateType(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const updatedType = await MedecineType.findByIdAndUpdate(req.params.id, {
    type: req.body.type,
  });
  res.send(updatedType);
});

router.get("/", [isAuth], async (req, res) => {
  const types = await MedecineType.find({
    secret_key: req.userToken.secret_key,
  });
  if (!types) return res.status(404).send("No such type was found");
  res.send(types);
});

router.get("/:id", [isAuth], async (req, res) => {
  const type = await MedecineType.findById(req.params.id);
  if (!type) return res.status(404).send("No such medecine type was found");
  res.send(type);
});

router.delete("/delete/:id", [isAuth], async (req, res) => {
  const type = await MedecineType.findById(req.params.id);
  if (!type) return res.status(404).send("Medecine not found");
  const type_to_erase = await MedecineType.findByIdAndRemove(req.params.id);
  res.send(type_to_erase);
});

module.exports = router;

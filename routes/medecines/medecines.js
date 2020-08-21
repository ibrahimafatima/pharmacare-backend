const express = require("express");
const moment = require("moment");
const isAuth = require("../../middleware/isAuth");
const {
  Medecines,
  validateMedecines,
} = require("../../model/medecines/medecines");
const { ExpiredMedecines } = require("../../model/medecines/expired-medecines");

const router = express.Router();

router.post("/add", [isAuth], async (req, res) => {
  const { error } = validateMedecines(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const medecine = await Medecines.findOne({
    $and: [{ name: req.body.name }, { secret_key: req.userToken.secret_key }],
  });
  if (medecine)
    return res.status(404).send("Medecine with this name already exist");
  const barcode = await Medecines.findOne({
    $and: [
      { barcode: req.body.barcode },
      { secret_key: req.userToken.secret_key },
    ],
  });
  if (barcode)
    return res.status(404).send("Medecine with this barcode exist already.");
  const new_medecine = new Medecines({
    name: req.body.name,
    generic: req.body.generic,
    type: req.body.type,
    price: req.body.price,
    cost_price: req.body.cost_price,
    quantity: req.body.quantity,
    store_name: req.body.store_name,
    rack: req.body.rack,
    shelf: req.body.shelf,
    expiry_date: req.body.expiry_date,
    barcode: req.body.barcode,
    secret_key: req.userToken.secret_key,
  });
  const result = await new_medecine.save();
  res.send(result);
});

router.put("/update/:id", [isAuth], async (req, res) => {
  const { error } = validateMedecines(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  //const medecine = await Medecines.findById(req.params.id);

  const updatedMedecine = await Medecines.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    generic: req.body.generic,
    type: req.body.type,
    price: req.body.price,
    cost_price: req.body.cost_price,
    quantity: req.body.quantity, //parseFloat(req.body.quantity) + parseFloat(medecine.quantity),
    store_name: req.body.store_name,
    rack: req.body.rack,
    shelf: req.body.shelf,
    expiry_date: req.body.expiry_date,
    barcode: req.body.barcode,
  });
  res.send(updatedMedecine);
});

router.get("/", [isAuth], async (req, res) => {
  const medecines = await Medecines.find({
    secret_key: req.userToken.secret_key,
  });
  if (!medecines) return res.status(404).send("No medecine was found.");
  const comparedDate = moment().format("YYYY/MM/DD");
  const expiredMed = medecines.filter((m) =>
    moment(m.expiry_date, "YYYY/MM/DD").isSameOrBefore(comparedDate)
  );
  if (expiredMed[0]) {
    const m = await ExpiredMedecines.find({
      $and: [
        { name: expiredMed[0].name },
        { secret_key: req.userToken.secret_key },
      ],
    });
    if (!m) {
      const new_expired_med = new ExpiredMedecines({
        name: expiredMed[0].name,
        generic: expiredMed[0].generic,
        type: expiredMed[0].type,
        price: expiredMed[0].price,
        cost_price: expiredMed[0].cost_price,
        quantity: expiredMed[0].quantity,
        store_name: expiredMed[0].store_name,
        rack: expiredMed[0].rack,
        shelf: expiredMed[0].shelf,
        expiry_date: expiredMed[0].expiry_date,
        barcode: expiredMed[0].barcode,
        secret_key: expiredMed[0].secret_key,
      });
      await new_expired_med.save();
    }
  }
  res.send(medecines);
});

router.get("/:id", [isAuth], async (req, res) => {
  const medecine = await Medecines.findById(req.params.id).select([
    "-__v",
    "-secret_key",
  ]);
  if (!medecine) return res.status(404).send("No such medecine was found");
  res.send(medecine);
});

router.delete("/delete/:id", [isAuth], async (req, res) => {
  const medecine = await Medecines.findById(req.params.id);
  if (!medecine) return res.status(404).send("Medecine not found");
  const medecine_to_erase = await Medecines.findByIdAndRemove(req.params.id);
  res.send(medecine_to_erase);
});

module.exports = router;

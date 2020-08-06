const express = require("express");
const moment = require("moment");
const isAuth = require("../../middleware/isAuth");
const { Medecines } = require("../../model/medecines/medecines");

const router = express.Router();

router.get("/", isAuth, async (req, res) => {
  const medecines = await Medecines.find({
    secret_key: req.userToken.secret_key,
  });
  if (!medecines) return res.status(404).send("No medecine was found.");
  const comparedDate = moment().format("YYYY/MM/DD");
  const expiredMed = medecines.filter((m) =>
    moment(m.expiry_date, "YYYY/MM/DD")
      .add(-4, "months")
      .isSameOrBefore(comparedDate)
  );
  res.send(expiredMed);
});

module.exports = router;

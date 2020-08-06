module.exports.isAdmin = (req, res, next) => {
  if (req.userToken.role !== "Admin")
    return res.status(403).send("You don't have permission");
  next();
};

module.exports.isManager = (req, res, next) => {
  if (req.userToken.role !== "Manager")
    return res.status(403).send("You don't have permission");
  next();
};

module.exports.isPharmacist = (req, res, next) => {
  if (req.userToken.role !== "Pharmacist")
    return res.status(403).send("You don't have permission");
  next();
};

module.exports.isAdminOrPharmacist = (req, res, next) => {
  if (req.userToken.role !== "Pharmacist" || req.userToken.role !== "Admin")
    return res.status(403).send("You don't have permission");
  next();
};

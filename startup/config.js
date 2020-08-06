const config = require("config");
const { Logger } = require("../utils/winston");

module.exports = () => {
  if (!config.get("jwtPrivateKey")) {
    Logger.error("FATAL ERROR: jwt is not defined.");
    process.exit(1);
  }
};

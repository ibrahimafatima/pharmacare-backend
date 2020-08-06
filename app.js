const express = require("express");

const app = express();

require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);
require("./startup/routes")(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Listen on port ${port}`));

const express = require("express");
const Router = express.Router();

const reset_Controller = require("../controller/reset_controller");

Router.post("/reset_password",reset_Controller.reset);
Router.post("/validate_password",reset_Controller.validation);
module.exports = Router;
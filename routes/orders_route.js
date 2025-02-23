const express = require("express");
const Router = express.Router();
const Orders_Controller = require("../controller/order_conroller");

Router.post("/",Orders_Controller.createOrder);
module.exports = Router;
const express = require("express");
const Router = express.Router();
const Orders_Controller = require("../controller/order_conroller");

Router.post("/",Orders_Controller.createOrder);
Router.get("/",Orders_Controller.getAllOrders)
Router.get("/status/:status",Orders_Controller.getOrdersByStatus)
Router.get("/:userId",Orders_Controller.getOrdersByUser)
module.exports = Router;
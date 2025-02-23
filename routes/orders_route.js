const express = require("express");
const Router = express.Router();
const Orders_Controller = require("../controller/order_conroller");

Router.post("/",Orders_Controller.createOrder);
Router.get("/",Orders_Controller.getAllOrders)
Router.get("/status/:status",Orders_Controller.getOrdersByStatus)
Router.get("/:userId",Orders_Controller.getOrdersByUser)
Router.get("/livrer/:userId",Orders_Controller.assignDelivery)
Router.get("/positions/:id",Orders_Controller.getOrderPositions)
Router.get("/:id",Orders_Controller.updateOrderStatus)
Router.get("/positions/:id",Orders_Controller.updateOrderPositions)

module.exports = Router;
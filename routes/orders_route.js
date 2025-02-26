const express = require("express");
const Router = express.Router();
const Orders_Controller = require("../controller/order_controller");

Router.post("/",Orders_Controller.createOrder);
Router.get("/",Orders_Controller.getAllOrders)
Router.get("/:id",Orders_Controller.getOneOrder);
Router.get("/status/:status",Orders_Controller.getOrdersByStatus)
Router.get("/:userId",Orders_Controller.getOrdersByUser)
Router.get("/livrer/:userId",Orders_Controller.assignDelivery)
Router.get("/positions/:id",Orders_Controller.getOrderPositions)
Router.put("/:id",Orders_Controller.updateOrderStatus)
Router.put("/positions/:id",Orders_Controller.updateOrderPositions)
Router.put("/livreurId/:id",Orders_Controller.updateOrderDeliveryId)
Router.get("/livrer/for/:userId",Orders_Controller.getOrdersByDeliveryStatus)

module.exports = Router;
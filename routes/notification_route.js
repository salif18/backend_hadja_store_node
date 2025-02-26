const express = require("express");
const Router = express.Router();

const Notification_Controller = require("../controller/notification_controller")

Router.post("/send-notification",Notification_Controller.sendNotification)
Router.get("/:userId",Notification_Controller.getNotification);
Router.get("/count/:userId",Notification_Controller.getNoReadCountNotification);
Router.put("/mark-as-read/:userId/:notificationId/:newStatus",Notification_Controller.marqueLueNotification)
Router.delete("/remove/:userId/:notificationId",Notification_Controller.deleteNotification);
module.exports = Router;
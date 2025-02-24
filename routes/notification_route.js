const express = require("express");
const Router = express.Router();

const Notification_Controller = require("../controller/notification_controller")

Router.post("/send-notification",Notification_Controller.sendNotification)
Router.get("/:userId",Notification_Controller.getNotification);
Router.put("/mark-as-read/:userId/:notificationId",Notification_Controller.marqueLueNotification)

module.exports = Router;
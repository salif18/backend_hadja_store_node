const express = require("express");
const Router = express.Router();

const updateUser_Controller = require("../controller/update_user_controller");
const Auth_Controller = require("../controller/auth_controller");
const middleware = require("../middlewares/AuthMiddleware");

Router.post("/registre",Auth_Controller.register);
Router.post("/login",Auth_Controller.login);

//RECURER LES LIVREURS
Router.get("/livreurs",updateUser_Controller.getLibery)
Router.post("/update_password/:userId",updateUser_Controller.updatePassword);
Router.post("/update/:userId",Auth_Controller.updateProfil);
Router.put("/livreurs/update/:id",updateUser_Controller.updateLibery);
Router.delete("/livreurs/delete/:id",updateUser_Controller.deleteLibery)
Router.post("/:userId/save-token",Auth_Controller.sendFmcToken);

module.exports = Router;
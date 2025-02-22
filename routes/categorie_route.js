const express = require("express");
const Router = express.Router();
const categorie_controller = require("../controller/categorie_controller")

Router.post("/",categorie_controller.createCategory)
Router.get("/",categorie_controller.getCategory)
Router.put("/update/:id",categorie_controller.updatedCategory)
Router.delete("/delete/:id",categorie_controller.delete)

module.exports = Router;
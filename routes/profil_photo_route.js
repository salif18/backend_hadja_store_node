const express = require("express");
const Router = express.Router();
const Profil_photo_Controller = require("../controller/profil_photo_controller")
const cloudFile = require("../middlewares/multercloudinar")

Router.post("/photo",cloudFile,Profil_photo_Controller.createPhoto)
Router.put("/photo/update",cloudFile,Profil_photo_Controller.updatePhoto)
Router.delete("/photo/delete",Profil_photo_Controller.deletePhoto)

module.exports = Router
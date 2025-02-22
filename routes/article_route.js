const express = require("express");
const Router = express.Router();
const cloudFileImg = require("../middlewares/multercloudinar_article")
const cloudFileGallerie = require("../middlewares/multercloudinar_gallerie")

const articles_Controller = require("../controller/article_controller");

const middleware = require("../middlewares/AuthMiddleware");

Router.post("/",cloudFileImg,articles_Controller.createArticle);
Router.get("/",articles_Controller.getArticles)



module.exports = Router;
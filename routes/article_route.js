const express = require("express");
const Router = express.Router();
const cloudFileImg = require("../middlewares/multercloudinar_article")
const cloudFileGallerie = require("../middlewares/multercloudinar_gallerie")

const articles_Controller = require("../controller/article_controller");

const middleware = require("../middlewares/AuthMiddleware");

Router.post("/",cloudFileImg,articles_Controller.createArticle);
Router.get("/",articles_Controller.getArticles)
Router.get("/articles_by_categories/:catego",articles_Controller.getArticlesByCategory)


module.exports = Router;
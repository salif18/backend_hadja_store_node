//CREATION DE MON APPLICATION 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const Auth_Router = require("./routes/auth_route");
const Reset_Router = require("./routes/reset_route");
const Article_Router = require("./routes/article_route");
const Categorie_Router = require("./routes/categorie_route")
const Profil_Photo_Router = require("./routes/profil_photo_route")
const Orders_Router = require("./routes/orders_route")
const Notification_Router = require("./routes/notification_route")

app.use(cors());
app.use(express.json());

// Établir la connexion à la base de données
mongoose.connect(process.env.DB_NAME)
  .then(() => console.log("Base de donneés connectées"))
  .catch(() => console.log("Echec de connection à la base des données"));

// Configurer les routes
app.use("/api/auth", Auth_Router);
app.use("/api/reset",Reset_Router)
app.use("/api/articles",Article_Router)
app.use("/api/categories",Categorie_Router)
app.use("/api/profil",Profil_Photo_Router)
app.use("/api/orders",Orders_Router);
app.use("/notifications",Notification_Router)

module.exports = app;

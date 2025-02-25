//CREATION DU SERVER POUR LIRE APPLICATION APP
require('dotenv').config(); // Charger les variables d'environnement
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io"); // Importer socket.io
const cors = require("cors");

app.set(process.env.PORT);

//CREER LE SERVER
const server = http.createServer(app);

// Configurer socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Autorise toutes les origines (à restreindre en production)
    }
  });


  // Gérer les connexions WebSocket
io.on("connection", (socket) => {
    console.log("Un client est connecté :", socket.id);
  
    // Écouter les événements personnalisés
    socket.on("send-notification", async (data) => {
      try {
        // Ici, vous pouvez ajouter la logique pour notifier le livreur
        console.log(`Livreur sélectionné : ${data}`);
  
        // Envoyer une notification au livreur
        const notification = {
          message: "Vous avez été sélectionné pour une nouvelle commande.",
          createdAt: new Date(),
        };
  
        // Envoyer la notification en temps réel au livreur
        io.to(livreurId).emit("nouvelle-notification", notification);
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error);
      }
    });
  
    // Gérer la déconnexion
    socket.on("disconnect", () => {
      console.log("Un client est déconnecté :", socket.id);
    });
  });
  
  

//LECTURE DU SERVER DEMARE APP
server.listen(process.env.PORT,()=>console.log(`Application en marche sur PORT:${process.env.PORT}`));
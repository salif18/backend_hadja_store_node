//CREATION DU SERVER POUR LIRE APPLICATION APP
require('dotenv').config(); // Charger les variables d'environnement
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io"); // Importer socket.io

app.set(process.env.PORT);

//CREER LE SERVER
const server = http.createServer(app);

// Configurer socket.io
const io = new Server(server, { cors: { origin: "*"} });

  // Gérer les connexions WebSocket
  io.on('connection', (socket) => {
    console.log(`Client connecté: ${socket.id}`);
    
    socket.on('join-room', (userId) => {
      socket.join(userId);
      console.log(`Utilisateur ${userId} a rejoint sa salle`);
    });
  
    socket.on('livreur-selectionne', (data) => {
      io.to(data.userId).emit('nouvelle-notification', {
        userId:data.userId,
        orderId: data.orderId,
        message: data.message,
        createdAt: new Date()
      });
    });
  });
  
  

//LECTURE DU SERVER DEMARE APP
server.listen(process.env.PORT,()=>console.log(`Application en marche sur PORT:${process.env.PORT}`));

// Exporte `io` pour l'utiliser ailleurs
module.exports = { app, server, io };
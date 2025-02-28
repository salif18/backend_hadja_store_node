require('dotenv').config(); // Charger les variables d'environnement

const app = require("./app");
const http = require("http");
// Créer le serveur
const server = http.createServer(app);
const { Server } = require("socket.io");


app.set('port',process.env.PORT || 8080 );


// Configurer Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // À restreindre en production
    methods: ["GET","POST", "PUT", "DELETE", "PATCH","OPTIONS"],
  },
});

// Gérer les connexions WebSocket
io.on('connection', (socket) => {
  console.log(`Client connecté: ${socket.id}`);

  // Écouter l'événement de connexion de l'utilisateur
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`Utilisateur ${userId} a rejoint sa salle`);
  });

  // Écouter l'événement de sélection de livreur
  socket.on('post-livreur', (data) => {
    console.log('Événement livreur-selectionne reçu:', data);
    io.to(data.userId).emit('get-notification', {
      userId: data.userId,
      orderId: data.orderId,
      username:data.username,
      message: data.message,
      createdAt: new Date(),
    });
  });

  // Écouter l'événement de déconnexion
  socket.on('disconnect', () => {
    console.log(`Client déconnecté: ${socket.id}`);
  });
});

// Démarrer le serveur
server.listen(process.env.PORT || 8080, () => {
  console.log(`Application en marche sur le port:${process.env.PORT || 8080}`);
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  console.error('Erreur du serveur:', error);
});;



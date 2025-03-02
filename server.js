require('dotenv').config(); // Charger les variables d'environnement
const app = require("./app");
const http = require("http");

// Créer le serveur
const server = http.createServer(app);

app.set('port',process.env.PORT || 8080 );

// Démarrer le serveur
server.listen(process.env.PORT || 8080, () => {
  console.log(`Application en marche sur le port:${process.env.PORT || 8080}`);
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  console.error('Erreur du serveur:', error);
});



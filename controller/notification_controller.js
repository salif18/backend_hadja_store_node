const User = require('../models/user_model');
const mongoose = require('mongoose');
const admin = require("firebase-admin");


exports.sendNotification = async (req, res) => {
  try {

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const notification = {
      orderId: new mongoose.Types.ObjectId(req.body.orderId),
      username:user.name,
      message: req.body.message,
      read:false,
      createdAt: new Date()
    };

    user.notifications.push(notification);

    await user.save();

    await admin.messaging().send({
      
        message: {
          token: user.fcmToken,
          notification: {
            title: "Nouvelle commande",
            body: "Vous avez reçu une nouvelle commande."
          },
          data: {
            orderId: new mongoose.Types.ObjectId(req.body.orderId),
            username: user.name,
            message: "Nouvelle commande",
            read: false,
            createdAt:new Date()
          }
        }

    });
    
    // Diffusion via WebSocket
    // io.to(req.body.userId).emit('nouvelle-notification', notification);
    
    return res.status(201).json(notification);
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
};

exports.getNotification = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
  // Trier les notifications par ordre décroissant selon leur date
  const sortedNotifications = user.notifications.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
      res.status(200).json({ notifications: sortedNotifications });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

exports.getNoReadCountNotification = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Trier les notifications par ordre décroissant selon leur date
      const sortedNotifications = user.notifications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  
      // Compter les notifications non lues
      const unreadCount = user.notifications.filter(n => !n.read).length;
  
      res.status(200).json({ 
        count: unreadCount // Ajout du nombre de notifications non lues
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
  
  
// exports.marqueLueNotification= async (req, res) => {
//     const { userId, notificationId ,newStatus} = req.params;
  
//     try {
//       const user = await User.findOne({_id:userId });
  
//       if (!user) {
//         return res.status(404).json({ message: 'Livreur non trouvé' });
//       }
  
//       const notification = user.notifications.id(notificationId);
//       if (notification) {
//         notification.read = newStatus;
//         await user.save();
//       }
  
//       res.status(200).json({ message: 'Notification marquée comme lue' });
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de la notification :', error);
//       res.status(500).json({ message: 'Erreur serveur' });
//     }
//   };

exports.marqueLueNotification = async (req, res) => {
  const { userId, notificationId, newStatus } = req.params;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const notification = user.notifications.id(notificationId);
      if (!notification) {
          return res.status(404).json({ message: "Notification non trouvée" });
      }

      // Convertir newStatus en booléen
      const isRead = newStatus === "true";

      // Mettre à jour directement en base de données
      await User.updateOne(
          { _id: userId, "notifications._id": notificationId },
          { $set: { "notifications.$.read": isRead } }
      );

      res.status(200).json({ message: "Notification mise à jour avec succès" });
  } catch (error) {
      console.error("Erreur lors de la mise à jour de la notification :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.deleteNotification= async (req, res) => {
    const { userId, notificationId } = req.params;
  
    try {
      const user = await User.findOne({_id:userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
  
      const notification = user.notifications.id(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }
        // Suppression de la notification
        await User.updateOne(
          { _id: userId },
          { $pull: { notifications: { _id: notificationId } } }
      );
  
      res.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
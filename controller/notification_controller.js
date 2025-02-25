const User = require('../models/user_model');
const mongoose = require('mongoose');

exports.sendNotification = async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
console.log(user);

    const notification = {
      orderId: new mongoose.Types.ObjectId(req.body.orderId),
      message: req.body.message,
      read:false,
      createdAt: new Date()
    };

    user.notifications.push(notification);

    console.log(user.notifications)

    await user.save();
    
    // Diffusion via WebSocket
    io.to(req.body.userId).emit('nouvelle-notification', notification);
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  exports.getNotification = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
  
      res.status(200).json({ notifications: user.notifications });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
  
  exports.marqueLueNotification= async (req, res) => {
    const { userId, notificationId } = req.params;
  
    try {
      const user = await User.findOne({_id:userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
  
      const notification = user.notifications.id(notificationId);
      if (notification) {
        notification.read = true;
        await user.save();
      }
  
      res.status(200).json({ message: 'Notification marquée comme lue' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
const User = require('../models/user_model');

exports.sendNotification = async (req, res) => {
    const { userId, message } = req.body;
    try {
      const user = await user.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Livreur non trouvé' });
      }
  
      // Ajouter la notification
      user.notifications.push({ message });
      await user.save();
  
      res.status(200).json({ message: 'Notification envoyée avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification :', error);
      res.status(500).json({ message: 'Erreur serveur' });
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
  
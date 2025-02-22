const User = require('../models/user_model');
const bcrypt = require('bcryptjs');


// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    
    const { current_password, new_password, confirm_password } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Utilisateur non trouvé"
      });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Mot de passe actuel incorrect"
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        status: false,
        message: "Vos mots de passe ne sont pas identiques"
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Mot de passe modifié avec succès"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// RECUPERER LES LIVREURS
exports.getLibery = async (req, res) => {
  try {
    const liberys = await User.find({ user_statut: "delivery" });
    res.status(200).json({
      status: true,
      theLiberys: liberys
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

// MODIFICATION LIVREUR
exports.updateLibery = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Utilisateur non trouvé"
      });
    }

    const updates = {
      name: req.body.name || user.name,
      phone_number: req.body.phone_number || user.phone_number,
      email: req.body.email || user.email,
      user_statut: req.body.user_statut || user.user_statut
    };

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      status: true,
      message: "Compte mis à jour avec succès !!",
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// SUPPRESSION LIVREUR
exports.deleteLibery = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Utilisateur non trouvé"
      });
    }

    res.status(200).json({
      status: true,
      message: "Compte supprimé avec succès !!"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
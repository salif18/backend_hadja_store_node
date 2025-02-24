// authController.js
require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const Profil = require("../models/profil_photo_model")

// Configuration
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes
const MAX_ATTEMPTS = 5;
const JWT_SECRET = process.env.SECRET_KEY;

// Helpers
const getExpirationMessage = (expirationDate) => {
  const time = expirationDate.toTimeString().split(' ')[0];
  return `Nombre maximal de tentatives atteint. Veuillez réessayer après ${time}.`;
};

// Contrôleur d'inscription
exports.register = async (req, res) => {
  try {

    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({
      $or: [
        { phone_number: req.body.phone_number },
        { email: req.body.email }
      ]
    });

    if (existingUser) {
      return res.status(401).json({
        status: false,
        message: "Ce numéro ou email existe déjà"
      });
    }

    // Création de l'utilisateur
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      name: req.body.name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      user_statut: req.body.user_statut,
      password: hashedPassword
    });

    await user.save();

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      status: true,
      message: "Compte créé avec succès !!",
      profil: user,
      userId: user._id,
      token
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Contrôleur de connexion
exports.login = async (req, res) => {
  try {

    // Recherche de l'utilisateur
    const user = await User.findOne({
      $or: [
        { phone_number: req.body.contacts },
        { email: req.body.contacts }
      ]
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Votre email est incorrect'
      });
    }

    // Vérification du blocage
    if (user.tentatives >= MAX_ATTEMPTS && user.tentatives_expires > Date.now()) {
      return res.status(429).json({
        message: getExpirationMessage(user.tentatives_expires)
      });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      user.tentatives += 1;
      if (user.tentatives >= MAX_ATTEMPTS) {
        user.tentatives_expires = Date.now() + BLOCK_DURATION;
      }
      await user.save();
      return res.status(401).json({
        status: false,
        message: 'Votre mot de passe est incorrect'
      });
    }

    // Réinitialisation des tentatives
    user.tentatives = 0;
    user.tentatives_expires = Date.now();
    await user.save();

    // Génération du token
    const token = jwt.sign(
      { userId: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const photo_profil = await Profil.findOne({ user_id: user._id });
    // Préparation de la réponse
    // Corrigez la construction du profil comme ceci :
    const profil = {
      name: user.name,
      phone_number: user.phone_number,
      email: user.email,
      user_statut: user.user_statut,
      photo: photo_profil?.photo || null, // Optional chaining + fallback
      photoId: photo_profil?._id || null
    };
    res.status(200).json({
      status: true,
      message: "Connecté avec succès !!",
      userId: user._id,
      token,
      profil
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Mise à jour du profil utilisateur
exports.updateProfil = async (req, res) => {
  const { userId } = req.params;
  const { name, phone_number, email } = req.body;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({
              status: false,
              message: 'Utilisateur non trouvé'
          });
      }

      // Mise à jour des informations de l'utilisateur
      if (name) user.name = name;
      if (phone_number) user.phone_number = phone_number;
      if (email) user.email = email;

      await user.save();

      return res.status(200).json({
          status: true,
          message: 'Modification apportée avec succès !!',
          profil: {
              name: user.name,
              phone_number: user.phone_number,
              email: user.email
          }
      });

  } catch (error) {
      return res.status(500).json({
          status: false,
          message: error.message
      });
  }
};


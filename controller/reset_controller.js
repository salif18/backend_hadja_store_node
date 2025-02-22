require("dotenv").config();
const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Configuration (à mettre dans un fichier séparé)
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes
const TENTATIVES_MAX = 3;

// Configuration email (exemple avec Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// RÉCUPÉRATION DE COMPTE
exports.reset = async (req, res) => {
  try {

    const { numero, email } = req.body;
    console.log(req.body)

    // Recherche utilisateur
    const user = await User.findOne({ 
      phone_number: numero, 
      email 
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Cet utilisateur n'existe pas"
      });
    }

    // Vérification blocage
    const now = Date.now();
    if (user.tentatives >= TENTATIVES_MAX && user.tentatives_expires > now) {
      const expiryTime = new Date(user.tentatives_expires);
      const timeString = expiryTime.toLocaleTimeString('fr-FR');
      return res.status(429).json({
        message: `Nombre maximal de tentatives atteint. Veuillez réessayer après ${timeString}.`
      });
    }

    // Génération token
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    user.remember_token = token;
    user.tentatives += 1;

    if (user.tentatives >= TENTATIVES_MAX) {
      user.tentatives_expires = Date.now() + BLOCK_DURATION;
    }

    await user.save();
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.MAIL_FROM_ADDRESS,
            pass:process.env.MAIL_PASSWORD,
        }
    })

    // Envoi email
    const mailOptions = {
      from: "hadja",
      to: user.email,
      subject: 'Récupération de compte',
      html: `Votre code de récupération est <b>${token}</b>`
    };

    await transporter.sendMail(mailOptions);

    // Envoi SMS (décommenter et configurer Twilio)
    // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await client.messages.create({
    //   body: `Le code de validation est ${token}.`,
    //   from: process.env.TWILIO_FROM,
    //   to: user.phone_number
    // });

    res.status(200).json({
      status: true,
      message: "Un code à 4 chiffres a été envoyé sur votre email",
      token // À retirer en production
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// VALIDATION DE COMPTE
exports.validation = async (req, res) => {
  try {
   

    const { resetToken, new_password, confirm_password } = req.body;

    // Recherche utilisateur
    const user = await User.findOne({ remember_token: resetToken });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Code invalide ou expiré"
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        status: false,
        message: "Les mots de passe ne correspondent pas"
      });
    }

    // Mise à jour utilisateur
    user.password = await bcrypt.hash(new_password, 10);
    user.remember_token = null;
    user.tentatives = 0;
    user.tentatives_expires = Date.now();
    await user.save();

    res.status(200).json({
      status: true,
      message: "Mot de passe réinitialisé avec succès"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
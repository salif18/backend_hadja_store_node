const Profil = require("../models/profil_photo_model")
const User = require("../models/user_model")
const cloudinary = require("../middlewares/cloudinary")

// POST - Ajouter une photo
exports.createPhoto = async (req, res) => {
  try {
    console.log(req.file)
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Aucune photo téléchargée"
      });
    }

     //valeur initial
            let photoUrl = "";
            let cloudinaryId = "";
            // Vérifier s'il y a un fichier
            if (req.file) {
                // Upload de l'image sur Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);
                photoUrl = result.secure_url;
                cloudinaryId = result.public_id;
            }
    
    const newProfil = await Profil.create({
      user_id: req.body.user_id,
      photo: photoUrl,
      cloudinaryId: cloudinaryId,
    });

    res.status(201).json({
      status: true,
      message: "Photo de profil ajoutée avec succès !!",
      photo: newProfil
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// PUT - Mettre à jour la photo
exports.updatePhoto= async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Aucune photo téléchargée"
      });
    }

    const profil = await Profil.findOne({ user_id: req.body.user_id });
    if (!profil) {
      return res.status(404).json({
        status: false,
        message: "Profil non trouvé"
      });
    }

    
    let imageUrl = profil.photo; // Garder l'image actuelle si pas de mise à jour
    let cloudinaryId = profil.cloudinaryId; // Garder l'ancien Cloudinary ID si non modifié

    if (req.file) {
        // Si le produit a déjà une image associée, la supprimer sur Cloudinary
        if (profil.cloudinaryId) {
            await cloudinary.uploader.destroy(profil.cloudinaryId);
        }
        
            // Uploader la nouvelle image sur Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url; // URL sécurisée de la nouvelle image
            cloudinaryId = result.public_id; // ID Cloudinary de la nouvelle image
    }

  
    profil.photo = imageUrl;
    profil.cloudinaryId= cloudinaryId

    await profil.save();

    res.status(200).json({
      status: true,
      message: "Photo de profil mise à jour avec succès !!",
      photo: profil
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// DELETE - Supprimer la photo
exports.deletePhoto= async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Utilisateur non trouvé"
      });
    }

    const profil = await Profil.findOne({ user_id: req.body.user_id });
    if (!profil?.photo) {
      return res.status(404).json({
        status: false,
        message: "Aucune photo de profil à supprimer"
      });
    }

     // Si le produit a un cloudinaryId, supprimer l'image sur Cloudinary
     if (profil.cloudinaryId) {
        await cloudinary.uploader.destroy(profil.cloudinaryId);
    }

    // Supprimer le produit
    await profil.deleteOne({ user_id: req.body.user_id });

    // Mise à jour BDD
    profil.photo = null;
    await profil.save();

    res.status(200).json({
      status: true,
      message: "Photo de profil supprimée avec succès !!"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


const Article = require("../models/article_model")
const cloudinary = require("../middlewares/cloudinary")

exports.createArticle = async (req, res) => {
    try {
      console.log(req.body)
        //valeur initial
        let imageUrl = "";
        let cloudinaryId = "";
        // Vérifier s'il y a un fichier
        if (req.file) {
            // Upload de l'image sur Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            cloudinaryId = result.public_id;
        }
      
        //  // Upload des images de la galerie
        //  const galleryImages = [];
        //  if (req.files && req.files.galleries) {
        //      for (const file of req.files.galleries) {
        //          const result = await cloudinary.uploader.upload(file.path);
        //          galleryImages.push({
        //              url: result.secure_url,
        //              public_id: result.public_id
        //          });
        //      }
        //  }
      const article = new Article({ 
        ...req.body,
        img: imageUrl,  // URL Cloudinary renvoyée dans req.file.path
        // galleries: galleryImages,
        cloudinaryId: cloudinaryId, // Enregistrer l'ID Cloudinary si nécessaire
      });
  
      await article.save();
      res.status(201).json(article);
      
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  }

 // Récupérer toutes les catégories
 exports.getArticles= async (req, res) => {
     try {
         const articles = await Article.find();
         return res.status(200).json({
             status: true,
             articles: articles
         });
     } catch (error) {
        return res.status(500).json({
             status: false,
             message: "Erreur survenue lors de la requête",
             error: error.message
         });
     }
 };

 // article.controller.js
exports.getArticlesByCategory = async (req, res) => {
  try {
    const category = req.params.catego;
    
    // Validation basique
    if (!category) {
      return res.status(400).json({
        status: false,
        message: "Le paramètre catégorie est requis"
      });
    }

    const articles = await Article.find({ categorie: category })
      .sort({ createdAt: -1 })
      .lean(); // Conversion en objet JavaScript simple

    if (articles.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Aucun article trouvé pour cette catégorie"
      });
    }

    res.status(200).json({
      status: true,
      message: `Articles trouvés pour la catégorie : ${category}`,
      count: articles.length,
      articles: articles
    });

  } catch (error) {
    console.error("Erreur getArticlesByCategory:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Erreur serveur lors de la récupération des articles"
    });
  }
};
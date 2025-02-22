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

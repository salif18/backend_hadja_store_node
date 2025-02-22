const Categorie = require("../models/categorie_model")


// Créer une catégorie
exports.createCategory= async (req, res) => {
    try {
        const newCategory = new Categorie(req.body);
        const savedCategory = await newCategory.save();

        res.status(201).json({
            status: true,
            message: "Catégorie ajoutée",
            categories: savedCategory
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur survenue lors de la requête",
            error: error.message
        });
    }
};

// Récupérer toutes les catégories
exports.getCategory= async (req, res) => {
    try {
        const categories = await Categorie.find();
        return res.status(200).json({
            status: true,
            categories: categories
        });
    } catch (error) {
       return res.status(500).json({
            status: false,
            message: "Erreur survenue lors de la requête",
            error: error.message
        });
    }
};

// Mettre à jour une catégorie
exports.updatedCategory=async (req, res) => {
    try {
        const category = await Categorie.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Catégorie non trouvée"
            });
        }

        category.name_categorie = req.body.name_categorie;
        const updatedCategory = await category.save();

        res.status(200).json({
            status: true,
            categories: updatedCategory,
            message: "Catégorie modifiée !!"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur survenue lors de la requête",
            error: error.message
        });
    }
};

// Supprimer une catégorie
exports.delete = async (req, res) => {
    try {
        const category = await Categorie.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Catégorie non trouvée"
            });
        }

        await category.deleteOne();

        res.status(200).json({
            status: true,
            message: "Catégorie supprimée !!"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Erreur survenue lors de la requête",
            error: error.message
        });
    }
};

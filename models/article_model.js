const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  img_path: {
    type: String,
    required: [true, 'Le chemin de l\'image est obligatoire']
  },
  cloudinaryId: {
    type: String,
    required: [true, 'L\'identifiant Cloudinary est obligatoire']
  }
}, { _id: false }); // Pas besoin d'_id pour les sous-documents

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  img: {
    type: String,
    required: [true, 'L\'image principale est obligatoire']
  },
  // galleries: {
  //   type: [gallerySchema],
  //   default: []
  // },
  cloudinaryId: { type: String },
  categorie: {
    type:String ,
    ref: 'Category',
    required: [true, 'La catégorie est obligatoire']
  },
  desc: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est obligatoire'],
    min: [0, 'Le stock ne peut pas être négatif']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  likes: {
    type: Number,
    default: 0
  },
  disLikes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});



module.exports = mongoose.model('Article', articleSchema);
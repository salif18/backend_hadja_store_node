const mongoose = require('mongoose');
// Modèle Mongoose
const profilSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    photo: {type:String},
    cloudinaryId:{type:String}
  });
  
  module.exports = mongoose.model('Profil', profilSchema);
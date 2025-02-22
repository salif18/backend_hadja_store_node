const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name_categorie:{
        type:String, required:[true ,"Veuillez entrer une categorie"]
    }
},{timestamps:true})

module.exports = mongoose.model('Categorie', schema);
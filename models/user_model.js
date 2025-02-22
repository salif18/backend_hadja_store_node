const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    user_statut: {
        type: String,
        default: "client",
        enum: ["client", "admin"] // Optionnel si vous souhaitez limiter les valeurs possibles
    },
    email_verified_at: {
        type: Date,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    tentatives: {
        type: Number,
        default: 0
    },
    tentatives_expires: {
        type: Date,
        default: Date.now
    },
    remember_token: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

// Schéma des articles commandés
const orderItemsSchema = new mongoose.Schema({
    order_id: { type: mongoose.Types.ObjectId, required: true, ref: "Order" },
    productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
    name: { type: String, required: true },
    img: { type: String, required: true },
    qty: { type: Number, required: true },
    prix: { type: Number, required: true }
}, { _id: false }); // Empêche Mongoose de générer un _id pour chaque item

// Schéma de la commande
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    deliveryId: { type: mongoose.Types.ObjectId, default: null, ref: "Delivery" },
    address: { type: String, required: true },
    clientLat: { type: Number, default: null },
    clientLong: { type: Number, default: null },
    deliveryLat: { type: Number, default: null },
    deliveryLong: { type: Number, default: null },
    telephone: { type: String, required: true },
    total: { type: Number, required: true },
    statut_of_delivery: { 
        type: String, 
        default: "En attente" 
    },
    order_items: [orderItemsSchema]
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', default: null },
    address: { type: String, required: true },
    clientLat: { type: Number, required: true },
    clientLong: { type: Number, required: true },
    deliveryLat: { type: Number, default: null },
    deliveryLong: { type: Number, default: null },
    telephone: { type: String, required: true },
    total: { type: Number, required: true },
    statut_of_delibery: { type: String, default: 'En attente' },
    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
            name: { type: String, required: true },
            img: { type: String, required: true },
            qty: { type: Number, required: true },
            prix: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);


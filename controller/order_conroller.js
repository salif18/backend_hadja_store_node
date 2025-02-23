const Order = require("../models/order_model");
const Article = require('../models/article_model');


// Créer une commande
exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
       console.log(req.body)
        // Création de la commande
        const orderData = {
            userId: req.body.userId,
            deliveryId: req.body.deliveryId,
            address: req.body.address,
            clientLat: req.body.clientLat,
            clientLong: req.body.clientLong,
            telephone: req.body.telephone,
            total: req.body.total,
            statut_of_delibery: req.body.statut_of_delibery || "En attente",
            order_items: []
        };

        const order = new Order(orderData);
        await order.save({ session });

        // Traitement des articles
        for (const item of req.body.articles) {
            const article = await Article.findById(item.productId).session(session);
            
            if (!article || item.qty > article.stock) {
                await session.abortTransaction();
                return res.status(400).json({
                    status: false,
                    message: `Stock insuffisant pour ${article?.name || 'produit inconnu'}`
                });
            }

            // Création de l'item
            order.order_items.push({
                productId: item.productId,
                name: item.name,
                img: item.img,
                qty: item.qty,
                prix: item.prix
            });

            // Mise à jour du stock
            article.stock -= item.qty;
            await article.save({ session });
        }

        await order.save({ session });
        await session.commitTransaction();
        
        res.status(201).json({
            status: true,
            message: "Commande créée avec succès",
            data: order
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            status: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

// Obtenir toutes les commandes
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('deliveryId', 'name phone')
            .populate('order_items.productId', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Obtenir les commandes par utilisateur
exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { userId: req.params.userId },
                { deliveryId: req.params.userId }
            ]
        })
        .populate('userId deliveryId', 'name phone')
        .populate('order_items.productId', 'name price')
        .sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Obtenir les positions d'une commande
exports.getOrderPositions = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .select('clientLat clientLong deliveryLat deliveryLong');

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Commande non trouvée"
            });
        }

        res.status(200).json({
            status: true,
            data: {
                clientLat: order.clientLat,
                clientLong: order.clientLong,
                deliveryLat: order.deliveryLat,
                deliveryLong: order.deliveryLong
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Mettre à jour les positions
exports.updateOrderPositions = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                deliveryLat: req.body.deliveryLat,
                deliveryLong: req.body.deliveryLong
            },
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: "Positions mises à jour",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Assigner un livreur
exports.assignDelivery = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { deliveryId: req.body.deliveryId },
            { new: true }
        ).populate('deliveryId', 'name phone');

        res.status(200).json({
            status: true,
            message: "Livreur assigné",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Obtenir les commandes par statut
exports.getOrdersByStatus = async (req, res) => {
    try {
        const orders = await Order.find({ statut_of_delibery: req.params.status })
            .populate('userId deliveryId', 'name phone')
            .populate('order_items.productId', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Mettre à jour le statut
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { statut_of_delibery: req.body.newStatus },
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: "Statut mis à jour",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
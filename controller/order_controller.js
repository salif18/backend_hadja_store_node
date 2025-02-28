const Order = require("../models/order_model");
const Article = require('../models/article_model');

// Créer une commande
// Créer une commande
exports.createOrder = async (req, res) => {

    try {
        const { cartItems } = req.body;

        // Traitement des articles
        for (const item of cartItems) {
            const article = await Article.findById(item.productId)

            if (!article || item.qty > article.stock) {

                return res.status(400).json({
                    status: false,
                    message: `Stock insuffisant pour ${article?.name || 'produit inconnu'}`
                });
            }

            // Mise à jour du stock
            article.stock -= item.qty;
            await article.save();
        }
        // Création de la commande
        const new_order = new Order({
            userId: req.body.userId,
            deliveryId: req.body.deliveryId,
            address: req.body.address,
            clientLat: req.body.clientLat,
            clientLong: req.body.clientLong,
            telephone: req.body.telephone,
            total: req.body.total,
            statut_of_delibery: req.body.statut_of_delibery || "En attente",
            cartItems: req.body.cartItems
        });

        await new_order.save();

        res.status(201).json({
            status: true,
            message: "Commande créée avec succès",
            order: new_order
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
// Obtenir toutes les commandes
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// Obtenir les commandes par utilisateur
exports.getOneOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: order.length,
            order: order
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
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.getOrdersByDeliveryStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({
            deliveryId: userId,
            statut_of_delibery: "Livrer"
        }) 
        .sort({ createdAt: -1 }); // Trie par ordre décroissant de création

        res.status(200).json({
            status: true,
            orders: orders
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
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
            orders: order
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

        res.status(201).json({
            status: true,
            message: "Livreur assigné",
            orders: order
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


exports.updateOrderDeliveryId = async (req, res) => {
    try {
        const { deliveryId } = req.body;
        const { id } = req.params;



        const order = await Order.findByIdAndUpdate(id, { deliveryId }, { new: true });

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Commande non trouvée",
            });
        }

        res.status(201).json({
            status: true,
            orders: order,
            message: "Livreur ajouté à la commande",
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};




// Obtenir les commandes par statut
exports.getOrdersByStatus = async (req, res) => {
    try {
        const orders = await Order.find({ statut_of_delibery: req.params.status })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};



exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStatus } = req.body;
    
        // Rechercher la commande par ID
        const order = await Order.findById(id);
    
        // Vérifier si la commande existe
        if (!order) {
            return res.status(404).json({ message: 'Commande introuvable.' });
        }
    
        // Vérifier si la commande est déjà livrée
        if (order.statut_of_delibery === 'Livrer') {
            return res.status(400).json({ message: 'La commande est déjà livrée et ne peut pas être modifiée.' });
        }
    
        // Restaurer les stocks si la commande est annulée
        if (order.statut_of_delibery !== "Annuler" && newStatus === "Annuler") {
            for (const item of order.cartItems) {
                const { productId, qty } = item;
                
                // Trouver le produit
                const article = await Article.findById(productId);
                if (!article) {
                    return res.status(404).json({ message: `Produit avec l'ID ${productId} introuvable.` });
                }

                // Mise à jour du stock
                article.stock += qty;
                await article.save();  
            }
        }
    
        // Mettre à jour le statut de la commande
        order.statut_of_delibery = newStatus;
        await order.save();
    
        return res.status(200).json({ message: 'Statut de la commande mis à jour avec succès.', order });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la commande :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

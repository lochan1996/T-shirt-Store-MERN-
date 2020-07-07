const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res,next,id) => {
    Order.findById(id)
        .populate("products.product","name price")
        .exec((err, order) => {
        if (err) {
            res.status(400).json({
                error:"No order in DB"
            })
        }
        req.order = order
        next()
    })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error:"Unable to create order"
            })
        }
        res.json(order)
    })
}

exports.getAllOrders = (req, res) => {
    Order.find().populate("user", "_id name").exec((err, orders) => {
        if (err) {
            res.status(400).json({
                error:"No orders found"
            })
        }
        res.json(orders)
    })
}

exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.paths("status").enumValues);
}

exports.updateStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error:"Could not update status"
                })
            }
            res.json(order)
        }
    )
}
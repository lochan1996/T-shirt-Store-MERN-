const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id).populate("Category").exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Product not found in DB"
            });
        }
        req.product = product
        next()
    })
}

//create product
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image"
            });
        }
        //destruction the fields
        const { name, description, price, category, stock } = fields 
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error:"Please include the fields"
            })
        }


        let product = new Product(fields)

        //handling the file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "photo is too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type

        }
        //save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error:"Saving t-shirt failed"
                })
            }
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//deleteproduct
exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Could not delete product"
            })
        }
        res.json({
            message: "Product deleted successfully"
        })
    })
}

//updateproduct
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image"
            });
        }
        

        //updation code
        let product = req.product
        product = _.extend(product, fields)


        //handling the file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "photo is too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type

        }
        //save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "updation of t-shirt failed"
                })
            }
            res.json(product)
        })
    })
}

//productlisting
exports.getAllProducts = (req, res) => {
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    /*Product.find().select("-photo").populate("Category").exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "NO product found"
            });
        }
        res.json(categories);
    });*/

    Product.find()
        .select("-photo")
        .populate("Category")
        .sort([[sortBy,"asc"]])
        .limit(limit)
        .exec((err, products) => {
        if (err) {
            res.status(400).json({
                error:"No product found"
            })
        }
        res.json(products)
    })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            });
        }
        next();
    });
};
exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error:"no category found"
            })
        }
        res.json(category)
    })
} 
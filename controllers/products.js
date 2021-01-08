const Product = require('../models/product');


module.exports = {
    barcode: async (req, res, next, barcode) => {
        await Product.findOne({barcode: barcode})
            .then( (product) => {
                // Case product does not exist
                if(!product) {
                    const err = new Error('product not found');
                    err.status = 404;
                    return next(err);
                }
                // Attach product to request
                req.product = product;
                req.productID = product.id;
                next();
            })
            .catch( () => {
                const err = new Error('barcode must be numeric');
                err.status = 400;
                next(err);
            })
    },

    readOne: async (req, res) => {
        return res.status(200).json({
            success: true,
            data: req.product
        })
    },

    create: async (req, res, next) => {
        const {barcode} = req.value.body;
        await Product.findOne({ barcode: barcode})
            .then(async (product) => {
                if (product) {
                    const err = new Error('product already exists');
                    err.status = 403;
                    throw err;
                }

                // Create new product
                const newProduct = new Product(req.value.body);
                await newProduct.save();
                return res.status(201).json({
                    success: true,
                    data: newProduct,
                })
            })
            .catch( (err) => {
                next(err);
            })
    },

    update: async (req, res, next) => {
        await Product.findByIdAndUpdate(req.productID, {$set: req.value.body}, {new: true})
            .then( (product) => {
                return res.status(200).json({
                    success: true,
                    data: product,
                })
            })
            .catch((err) => {
                next(err);
            })
    },

    delete: async (req, res, next) => {
        req.product.remove()
            .then( (product) => {
                res.status(200).json({
                    success: true,
                    deleted: product.id,
                })
            })
            .catch( (err) => {
                next(err);
            })
    }
}
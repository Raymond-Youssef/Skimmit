const Product = require('../models/product');

module.exports = {
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
                    created: newProduct,
                })
            })
            .catch( (err) => {
                next(err);
            })
    },

    productID: async (req, res, next, id) => {
        await Product.findById(id)
            .then( (product) => {
                if(!product) {
                    const err = new Error('product not found');
                    err.status = 404;
                    return next(err);
                }
                req.product = product;
                next();
            })
            .catch( () => {
                const err = new Error('invalid id');
                err.status = 400;
                next(err);
            })
    },

    readProductByID: async (req, res, next) => {
        res.status(200).json({
            success: true,
            product: req.product
        })
    }
}
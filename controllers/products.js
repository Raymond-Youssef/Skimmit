const Product = require('../models/product');


module.exports = {
    productID: async (req, res, next, id) => {
        await Product.findById(id)
            .then( (product) => {
                // Case product does not exist
                if(!product) {
                    const err = new Error('product not found');
                    err.status = 404;
                    return next(err);
                }
                // Attach product to request
                req.product = product;
                req.productID = id;
                next();
            })
            .catch( () => {
                // case product id is invalid
                const err = new Error('invalid id');
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
        console.log(req.value.body);
        await Product.findByIdAndUpdate(req.productID, {$set: req.value.body}, {new: true})
            .then( (product) => {
                return res.status(200).json({
                    success: true,
                    data: product,
                })
            })
    },


}
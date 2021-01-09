const {Product} = require('../models/product');
const PRODUCTS_PER_PAGE = 5;

module.exports = {
    barcode: async (req, res, next, barcode) => {
        try {
            const product = await Product.findByBarcode(barcode);
            req.product = product;
            req.productID = product.id;
            next();
        } catch (err) {
            next(err);
        }
    },

    readAll: async (req, res, next) => {
        const page = isNaN(req.query.page)? 1:Number(req.query.page);
        const start = (page - 1) * PRODUCTS_PER_PAGE;
        const end = start + PRODUCTS_PER_PAGE;
        await Product.find({})
            .then(products => {
                const paginatedProducts = products.slice(start, end);
                if(paginatedProducts.length === 0) {
                    const err = new Error('page is empty');
                    err.status = 404;
                    throw err;
                }
                return res.status(200).json({
                    success: true,
                    data: paginatedProducts,
                    page: page,
                })
            })
            .catch( (err) => {
                next(err);
            } )
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
                    deleted: product.barcode,
                })
            })
            .catch( (err) => {
                next(err);
            })
    }
}
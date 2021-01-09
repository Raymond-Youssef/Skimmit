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
            .populate('diseases', 'name')
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
        await req.product.populate('diseases','name').execPopulate()
        return res.status(200).json({
            success: true,
            data: req.product
        })
    },


    create: async (req, res, next) => {
        try {
            const {barcode} = req.value.body;
            // Check if a product with the same barcode exists
            const product = await Product.findOne({ barcode: barcode});
            if(product) {
                const err = new Error('product already exists');
                err.status = 403;
                next(err);
            }
            // Create a new product
            const newProduct = new Product(req.value.body);
            await newProduct.save();
            await newProduct.populate('diseases','name').execPopulate();
            return res.status(201).json({
                success: true,
                data: newProduct,
            })
        } catch (err) {
            next(err);
        }
    },


    update: async (req, res, next) => {
        await Product.findByIdAndUpdate(req.productID, {$set: req.value.body}, {new: true})
            .populate('diseases', 'name')
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
        try {
            const product = await req.product.remove();
            await product.populate('diseases', 'name').execPopulate();
            res.status(200).json({
                success: true,
                deleted: product,
            })
        } catch (err) {
            next(err);
        }
    }
}
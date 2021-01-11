const {Product} = require('../models/product');
const {Disease} = require('../models/disease');
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
        Product.find({})
            .limit(PRODUCTS_PER_PAGE)
            .skip((page-1)*PRODUCTS_PER_PAGE)
            .populate('diseases', 'name')
            .then(products => {
                if(products.length === 0) {
                    const err = new Error('page is empty');
                    err.status = 404;
                    throw err;
                }
                return res.status(200).json({
                    success: true,
                    data: products,
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
                return next(err);
            }
            // Create a new product
            const newProduct = new Product(req.value.body);
            await Disease.validateDiseases(req.value.body.diseases);
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
        try{
            await Disease.validateDiseases(req.value.body.diseases);
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
        } catch (err) {
            next(err);
        }
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
    },


    search: async (req, res, next) => {
        const page = isNaN(req.query.page)? 1:Number(req.query.page);
        await Product.find({name: {$regex: req.params.productName, $options: 'i'}})
            .limit(PRODUCTS_PER_PAGE)
            .skip((page-1)*PRODUCTS_PER_PAGE)
            .populate('diseases', 'name')
            .then( (products) => {
                if(products.length === 0) {
                    const err = new Error('no results were found');
                    err.status = 404;
                    throw err;
                }
                return res.status(200).json({
                    success: true,
                    data: products,
                    page: page,
                })
            })
            .catch( err => {
                next(err);
            })
    },
}
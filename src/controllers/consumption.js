const Consume = require('../models/consumption');
const {Product} = require('../models/product');


module.exports = {
    todayConsumption: (req, res, next) => {
        Consume.findOrCreateDailyConsumptionDocument(req.user)
            .then( document => {
                res.status(200).json({
                    success: true,
                    data: document,
                })
            })
            .catch( err => {
                next(err);
            })
    },


    allTimeConsumption: async (req, res, next) => {
        Consume.find({userID: req.user._id}).select('-userID')
            .then( documents => {
                res.status(200).json({
                    success: true,
                    data: documents,
                });
            })
            .catch( (err) => {
                next(err);
            })
    },


    consumeProduct: async (req, res, next) => {
        try {
            const product = await Product.findByBarcode(req.value.body.barcode);
            const dailyConsumptionDocument = await Consume.findOrCreateDailyConsumptionDocument(req.user);
            await dailyConsumptionDocument.consumeProduct(product, req.value.body.quantity);
            await product.populate('diseases', 'name').execPopulate();
            res.status(200).json({
                success: true,
                data: product,
            })
        } catch (err) {
            next(err);
        }
    },
}
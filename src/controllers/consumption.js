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

    yesterdayConsumption: async (req, res, next) => {
        try{
            let cutoff = new Date();
            cutoff.setDate(cutoff.getDate()-1);
            const yesterdayDate = (cutoff).toISOString().split('T')[0];
            const yesterdayConsumption = await Consume.findOne({
                userID: req.user.id,
                date: yesterdayDate,
            })
            res.status(200).json({
                success: true,
                data: yesterdayConsumption
            })
        } catch (err) {
            next(err);
        }
    },

    weekConsumption: async (req, res, next) => {
        try{
            let cutoff = new Date();
            cutoff.setDate(cutoff.getDate()-7);
            const weekConsumption = await Consume.find({
                userID: req.user.id,
                date: {$gte: cutoff},
            })
            res.status(200).json({
                success: true,
                data: weekConsumption
            })
        } catch (err) {
            next(err);
        }
    },


    dateConsumption: async (req, res, next) => {
        const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateRegEx.test(req.params.date)) {
            const err = new Error('date format must be yyyy-mm-dd');
            err.status = 400;
            next(err);
        }
        Consume.findOne({
            userID:req.user.id,
            date: req.params.date
        }).then( document => {
            if (!document) {
                const err = new Error('no consumption were found on that date');
                err.status = 404;
                throw err;
            }
            return res.status(200).json({
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
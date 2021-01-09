const Consume = require('../models/consumption');
const {Product} = require('../models/product');


module.exports = {
    consumeProduct: async (req, res, next) => {
        try {
            const product = await Product.findByBarcode(req.value.body.barcode);
            const dailyConsumptionDocument = await Consume.findOrCreateDailyConsumptionDocument(req.user);
            await dailyConsumptionDocument.consumeProduct(product, req.value.body.quantity);
            res.status(200).json({
                success: true,
                data: product,
            })
        } catch (err) {
            next(err);
        }
    },


    // todayConsumption: async (req, res, next) => {
    //
    // }
}
const Product = require('../models/product');

module.exports = {
    create: async (req, res, next) => {
        res.status(200).json({
            success: true
        })
    }
}
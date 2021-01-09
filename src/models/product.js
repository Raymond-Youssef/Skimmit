const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create a schema
const productSchema = new Schema({
    name: {
        type: String,
        min: 2,
        required: [true, 'name is required']
    },
    barcode: {
        type: Number,
        required: [true, 'barcode is required'],
        unique: true,
        index: true,
    },
    imageURL: {
        type: String,
    },
    meta: {
        calories: {
            type: Number,
        },
        sodium: {
            type: Number,
        },
        sugar: {
            type: Number,
        }
    },
    diseases: [{
        type: Schema.Types.ObjectId,
        ref: 'Disease',
        required: true,
    }],
})


// Create a model
const Product = mongoose.model('Product', productSchema);

Product.findByBarcode = async function(barcode) {
    if(isNaN(barcode)) {
        const err = new Error('barcode must be a number');
        err.status = 400;
        throw err;
    }
    const product = await Product.findOne({barcode: barcode});
    if (!product) {
        const err = new Error('product not found');
        err.status = 404;
        throw err;
    }
    return product;
}

// Export the Model and the Schema
module.exports = {Product, productSchema};
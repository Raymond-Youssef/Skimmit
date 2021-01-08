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
        required: [true, 'barcode is required']
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
    }
})


// Create a model
const Product = mongoose.model('Product', productSchema);


// Export the Model and the Schema
module.exports = {Product, productSchema};
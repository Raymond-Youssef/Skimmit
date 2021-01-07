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
        required: [true, 'image URL is missing']
    },
    meta: {
        calories: {
            type: Number,
            required: [true, 'number of calories is required'],
        },
        sodium: {
            type: Number,
            required: [true, 'sodium amount is required']
        },
        sugar: {
            type: Number,
            required: [true, 'sugar amount is required']
        }
    }
})


// Create a model
let Product = mongoose.model('Product', productSchema);


// Export the model
module.exports = Product;
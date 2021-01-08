const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {productSchema} = require('./product');


// Create Schema
const consumptionSchema = new Schema({
    date: Date,
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        product: productSchema,
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    daily_calories: {
        type: Number,
        required: true,
    }
})


// Create a model
const Consumption = mongoose.model('Consume', consumptionSchema);


// Export the model
module.exports = Consumption;
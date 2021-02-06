const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const consumptionSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
    },
    products:[{
        _id: false,
        name: String,
        barcode: Number,
        imageURL: String,
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    daily_calories: {
        type: Number,
        required: true,
        default: 0,
    }
});


// Combination of date and userID must be unique
consumptionSchema.index({date: 1, userID: 1}, {unique: true});


// Function to Consume a product
consumptionSchema.methods.consumeProduct = async function (givenProduct, quantity){
    quantity = quantity?quantity:1;
    const existingProductIndex = this.products.findIndex( product => product.barcode === givenProduct.barcode);
    if(existingProductIndex !== -1) {
        this.products[existingProductIndex].quantity+=quantity;
    }
    else {
        this.products.push({
            name: givenProduct.name,
            barcode: givenProduct.barcode,
            imageURL: givenProduct.imageURL,
            quantity: quantity,
        });
    }
    this.daily_calories += quantity*givenProduct.meta.calories;
    this.save();
};


// Create a model
const Consume = mongoose.model('Consume', consumptionSchema);


// Consumption document
Consume.findOrCreateDailyConsumptionDocument = async function(user) {
    try {
        const todayDate = (new Date()).toISOString().split('T')[0];
        const existingConsumption = await Consume.findOne({
            userID: user.id,
            date: todayDate,
        });

        if (existingConsumption) {
            return existingConsumption;
        }

        const newConsumption = new Consume({
            userID: user.id,
            date: todayDate,
        });
        await newConsumption.save();
        return newConsumption;
    } catch (err) {
        throw new Error(err);
    }
};


// Export the model
module.exports = Consume;
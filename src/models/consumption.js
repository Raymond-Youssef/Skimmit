const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const consumptionSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: Date,
    products:[{
        _id: false,
        name: String,
        barcode: Number,
        imageURL: String,
        meta: {
            calories: Number,
            sodium: Number,
            sugar: Number,
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    daily_calories: {
        type: Number,
        required: true,
        default: 0,
    }
})

// Combination of date and userID must be unique
consumptionSchema.index({date: 1, userID: 1}, {unique: true});


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
            meta: givenProduct.meta,
            quantity: quantity,
        });
    }
    this.daily_calories += quantity*givenProduct.meta.calories;
    this.save();
}


// Create a model
const Consume = mongoose.model('Consume', consumptionSchema);

Consume.findOrCreateDailyConsumptionDocument = async function(user) {
    try {
        const existingConsumption = await Consume.findOne({
            userID: user.id,
            date: (new Date()).toISOString().split('T')[0]
        })

        if (existingConsumption) {
            return existingConsumption;
        }

        const newConsumption = new Consume({
            userID: user.id,
            date: (new Date()).toISOString().split('T')[0],
        });
        await newConsumption.save();
        return newConsumption;
    } catch (err) {
        throw new Error(err);
    }
}





// Export the model
module.exports = Consume;
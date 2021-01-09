const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create a schema
const diseaseSchema = new Schema({
    name: {
        type: String,
        min: 2,
        required: [true, 'name is required']
    }
})

// Create a model
const Disease = mongoose.model('Disease', diseaseSchema);

module.exports = {diseaseSchema, Disease};
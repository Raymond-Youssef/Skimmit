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


Disease.validateDiseases = async function(diseases) {
    for (const diseaseID of diseases) {
        const existingDisease = await Disease.findById(diseaseID);
        if (!existingDisease) {
            const err = new Error(`${diseaseID} does not belong to any disease`);
            err.status = 404;
            throw err;
        }
    }
}

// Export model
module.exports = {diseaseSchema, Disease};
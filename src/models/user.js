const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


// Create a schema
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email has already been used'],
        lowercase: true
    },
    password: {
        type: String,
        default: null,
    },
    googleID: {
        type: String,
        default: null,
    },
    facebookID: {
        type: String,
        default: null,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [5, 'names can not be shorter than 5 characters'],
        maxlength: [30, 'names can not be longer than 30 characters']
    },
    age: {
        type: Number,
        required: false,
        min: [10, 'age can not be less than 10'],
        max: [100, 'age can not be more than 100']
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: false
    },
    height: {
        type: Number,
        min: [0, 'height can not be negative'],
        required: false
    },
    weight: {
        type: Number,
        required: false
    },
    BMR: {
        type: Number,
        required: false
    },
},{
    timestamps: true
})


userSchema.pre('save', async function(next) {
    try {
        if(this.age && this.height && this.weight) {
            this.BMR = 300; //TODO: calculate BMR later
        }
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods.hashPassword = async function() {
    try{
        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Generate a password hash ( salt + hash) and Re-assign hashed version over original plain-text password
        this.password = await bcrypt.hash(this.password, salt);

    } catch(err) {
        throw new Error(err);
    }
}


userSchema.methods.isValidPassword = async function(givenPassword) {
    try {
        return await bcrypt.compare(givenPassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
}


// Create a model
const User = mongoose.model('User', userSchema);


// Export the Model and Schema
module.exports = User;
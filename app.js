const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then( (mongoose) => {
    console.log(`Connected to MongoDB on Port: ${mongoose.connections[0].port}`);
})

app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));


app.use(require('./error-handler'));

// Start server
const PORT = process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express is listening on Port: ${PORT}`)
})
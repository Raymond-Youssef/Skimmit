const productsRouter = require('express-promise-router')();
const ProductsController = require('../controllers/users');

const auth = require('../authenticate.js');


productsRouter.post('/',
    auth.adminAuth,
    (req, res, next) => {
    // console.log(req.user);
    console.log('here');
})

module.exports = productsRouter;
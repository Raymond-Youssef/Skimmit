const productsRouter = require('express-promise-router')();
const ProductsController = require('../controllers/products');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


productsRouter.post('/',
    auth.adminAuth,
    validateBody(schemas.productSchema),
    ProductsController.create,
);

module.exports = productsRouter;
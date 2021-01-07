const productsRouter = require('express').Router();
const ProductsController = require('../controllers/products');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


productsRouter.param('id',
    ProductsController.productID
);


productsRouter.get('/:id',
    ProductsController.readProductByID
);

productsRouter.post('/',
    auth.adminAuth,
    validateBody(schemas.productSchema),
    ProductsController.create,
);

module.exports = productsRouter;
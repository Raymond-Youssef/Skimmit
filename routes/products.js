const productsRouter = require('express').Router();
const ProductsController = require('../controllers/products');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


// Handle parameters
productsRouter.param('id',
    ProductsController.productID
);


// Read product by id
productsRouter.get('/:id',
    ProductsController.readOne
);


// Create a new product
productsRouter.post('/',
    auth.adminAuth,
    validateBody(schemas.createProductSchema),
    ProductsController.create,
);

productsRouter.patch('/:id',
    auth.adminAuth,
    validateBody(schemas.patchProductSchema),
    ProductsController.update,
)

module.exports = productsRouter;
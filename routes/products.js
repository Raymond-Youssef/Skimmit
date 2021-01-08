const productsRouter = require('express').Router();
const ProductsController = require('../controllers/products');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


// Handle parameters
productsRouter.param('barcode',
    ProductsController.barcode
);


// Read product by id
productsRouter.get('/:barcode',
    ProductsController.readOne
);


// Create a new product
productsRouter.post('/',
    auth.adminAuth,
    validateBody(schemas.createProductSchema),
    ProductsController.create,
);


// Update an existing product
productsRouter.patch('/:barcode',
    auth.adminAuth,
    validateBody(schemas.patchProductSchema),
    ProductsController.update,
);


// Delete a product
productsRouter.delete('/:barcode',
    auth.adminAuth,
    ProductsController.delete,
);



module.exports = productsRouter;
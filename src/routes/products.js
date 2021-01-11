const productsRouter = require('express').Router();
const ProductsController = require('../controllers/products');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


// Handle parameters
productsRouter.param('barcode',
    ProductsController.barcode
);


// Get all products
productsRouter.get('/',
    ProductsController.readAll,
);


// Search Product by Name
productsRouter.get('/search/:productName',
    ProductsController.search
);


// Read product by barcode
productsRouter.get('/:barcode',
    ProductsController.readOne
);


// Create a new product
productsRouter.post('/',
    auth.adminAuth,
    validateBody(schemas.products.create),
    ProductsController.create,
);


// Update an existing product
productsRouter.patch('/:barcode',
    auth.adminAuth,
    validateBody(schemas.products.patch),
    ProductsController.update,
);


// Delete a product
productsRouter.delete('/:barcode',
    auth.adminAuth,
    ProductsController.delete,
);


module.exports = productsRouter;
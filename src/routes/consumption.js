const consumptionRouter = require('express').Router();
const ConsumptionController = require('../controllers/consumption');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


consumptionRouter.post('/',
    auth.consumeAuth,
    validateBody(schemas.consumeProductSchema),
    ConsumptionController.consumeProduct,
);


module.exports = consumptionRouter;
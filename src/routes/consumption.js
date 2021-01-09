const consumptionRouter = require('express').Router();
const ConsumptionController = require('../controllers/consumption');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


// Get today's Consumption
consumptionRouter.get('/',
    auth.userAuth,
    ConsumptionController.todayConsumption
)

// Consume a product
consumptionRouter.post('/',
    auth.userAuth,
    validateBody(schemas.consumeProductSchema),
    ConsumptionController.consumeProduct,
);


module.exports = consumptionRouter;
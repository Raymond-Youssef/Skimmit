const diseasesRouter = require('express').Router();
const DiseaseController = require('../controllers/diseases');
const {validateBody, schemas} = require('../helpers/validators');


const auth = require('../authenticate.js');


// Handle parameter
diseasesRouter.param('diseaseID',
    DiseaseController.diseaseID,
);


diseasesRouter.get('/',
    DiseaseController.readAll,
);


diseasesRouter.get('/:diseaseID',
    DiseaseController.readOne
);


diseasesRouter.post('/',
    auth.adminAuth,
    validateBody(schemas.diseaseSchema),
    DiseaseController.create,
)


diseasesRouter.patch('/:diseaseID',
    auth.adminAuth,
    validateBody(schemas.diseaseSchema),
    DiseaseController.update,
);


diseasesRouter.delete('/:diseaseID',
    auth.adminAuth,
    DiseaseController.delete,
);


// Export the router
module.exports = diseasesRouter;
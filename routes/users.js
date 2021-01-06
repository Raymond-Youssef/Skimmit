const usersRouter = require('express-promise-router')();
const UsersController = require('../controllers/users');
const {validateBody, schemas} = require('../helpers/validators');
const passport = require('passport');


usersRouter.post('/signup',
    validateBody(schemas.authSchema)
)


usersRouter.post('/signin',
    validateBody(schemas.authSchema)
)


usersRouter.post('/oauth/google');


usersRouter.post('/oauth/facebook');

module.exports = usersRouter;
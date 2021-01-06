const usersRouter = require('express-promise-router')();
const UsersController = require('../controllers/users');
const {validateBody, schemas} = require('../helpers/validators');
const passport = require('passport');
require('../passport');


usersRouter.post('/signup',
    validateBody(schemas.signupSchema),
    UsersController.signUp
);


usersRouter.post('/signin',
    validateBody(schemas.signinSchema),
    passport.authenticate('Local-Strategy', {session: false}), // This will attach req.user
    UsersController.signIn
);


usersRouter.post('/oauth/google',
    passport.authenticate('Google-Strategy', {session: false}),
    UsersController.googleOAuth
);


// usersRouter.post('/oauth/facebook');

module.exports = usersRouter;
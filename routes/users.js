const usersRouter = require('express').Router();
const UsersController = require('../controllers/users');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


usersRouter.post('/signup',
    validateBody(schemas.signupSchema),
    UsersController.signUp
);


usersRouter.post('/signin',
    validateBody(schemas.signinSchema),
    auth.localStrategy, // This will attach req.user
    UsersController.signIn
);


usersRouter.post('/oauth/google',
    auth.googleStrategy,
    UsersController.googleOAuth
);


usersRouter.post('/oauth/facebook',
    auth.facebookStrategy,
    UsersController.facebookOAuth
);


usersRouter.post('/setPassword',
    auth.userAuth,
    validateBody(schemas.passwordSettingSchema),
    UsersController.setPassword
);

module.exports = usersRouter;
const usersRouter = require('express').Router();
const UsersController = require('../controllers/users');
const {validateBody, schemas} = require('../helpers/validators');

const auth = require('../authenticate.js');


usersRouter.post('/signup',
    validateBody(schemas.users.signup),
    UsersController.signUp
);


usersRouter.post('/signin',
    validateBody(schemas.users.signin),
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


usersRouter.post('/password/set',
    auth.userAuth,
    validateBody(schemas.users.setPassword),
    UsersController.setPassword
);


usersRouter.post('/password/reset',
    auth.userAuth,
    validateBody(schemas.users.resetPassword),
    UsersController.resetPassword
);

usersRouter.patch('/',
    auth.userAuth,
    validateBody(schemas.users.update),
    UsersController.update,
);

module.exports = usersRouter;
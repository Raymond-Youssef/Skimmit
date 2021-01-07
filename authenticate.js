const passport = require('passport');
require('./passport');

module.exports = {
    localStrategy: passport.authenticate('Local-Strategy', {session: false}),
    googleStrategy: (req, res, next) => {
        passport.authenticate('Google-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('Invalid Google access token');
                error.code = 401;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    },
    facebookStrategy: (req, res, next) => {
        passport.authenticate('Facebook-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('Invalid Facebook access token');
                error.code = 401;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    }
}
const passport = require('passport');
require('./passport');


module.exports = {
    localStrategy: passport.authenticate('Local-Strategy', {session: false}),

    googleStrategy: (req, res, next) => {
        passport.authenticate('Google-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('invalid google access token');
                error.status = 401;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    },

    facebookStrategy: (req, res, next) => {
        passport.authenticate('Facebook-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('invalid facebook access token');
                error.status = 401;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    },

    userAuth: (req, res, next) => {
        passport.authenticate('JWT-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('unauthorized');
                error.status = 401;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    },
    consumeAuth: (req, res, next) => {
        passport.authenticate('JWT-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('unauthorized');
                error.status = 401;
                return next(error);
            }
            if (!user.BMR) {
                const error = new Error('you need to set your BMR');
                error.status = 422;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    },

    adminAuth: (req, res, next) => {
        passport.authenticate('JWT-Strategy', {session: false}, (err, user) => {
            if (err || !user) {
                const error = new Error('unauthorized');
                error.status = 401;
                return next(error);
            }
            if(!user.isAdmin) {
                const error = new Error('only admins are authorized');
                error.status = 401;
                return next(error);
            }
            req.user = user;
            return next();
        })(req, res, next);
    }
}
const errorsHandler = require('express').Router();

module.exports = [
    (req, res, next) => {
        const err = new Error('not found');
        err.code = 404;
        next(err);
    },
    (err, req, res, next) => {
        res.status(err.code).json({
            success: false,
            message: err.message,
        });
        next();
    },
]
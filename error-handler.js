const errorsHandler = require('express').Router();

module.exports = [
    (req, res, next) => {
        const err = new Error('not found');
        err.status = 404;
        next(err);
    },
    (err, req, res, next) => {
        res.status(err.status).json({
            success: false,
            message: err.message,
        });
        next();
    },
]
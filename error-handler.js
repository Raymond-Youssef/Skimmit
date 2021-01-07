const errorsHandler = require('express').Router();

module.exports = [
    (err, req, res, next) => {
        res.status(err.code).json({
            success: false,
            message: err.message,
        });
        next();
    },
]
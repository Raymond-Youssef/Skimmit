
module.exports = [
    (req, res, next) => {
        const err = new Error('not found');
        err.status = 404;
        next(err);
    },
    (err, req, res, next) => {
        const status = err.status?err.status:500;
        res.status(status).json({
            success: false,
            error: status,
            message: err.message,
        });
        next();
    },
];
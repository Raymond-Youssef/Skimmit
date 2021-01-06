const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                return res.status(400).json({
                    success: false,
                    errors: result.error.details.map((detail) => detail.message),
                })
            }
            if (!req.value) {req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(128).required()
        })
    }
}
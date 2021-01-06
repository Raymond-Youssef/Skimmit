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
        signupSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            name: Joi.string().min(5).max(30).required(),
            password: Joi.string().min(8).max(128).required(),
            confirm_password: Joi.any().equal(Joi.ref('password'))
                .required()
                .messages({ 'any.only': '{{#label}} does not match' })
        }),
        signinSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(128).required(),
        })
    }
}
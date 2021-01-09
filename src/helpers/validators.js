const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                return res.status(400).json({
                    success: false,
                    message: "validation failed",
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
            confirm_password: Joi.string().equal(Joi.ref('password'))
                .required()
                .messages({ 'any.only': '{{#label}} does not match' })
        }),

        signinSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(128).required(),
        }),

        passwordSettingSchema: Joi.object().keys({
            password: Joi.string().min(8).max(128).required(),
            confirm_password: Joi.string().equal(Joi.ref('password'))
                .required()
                .messages({ 'any.only': '{{#label}} does not match' })
        }),

        createProductSchema: Joi.object().keys({
            name: Joi.string().required(),
            barcode: Joi.number().required(),
            meta: Joi.object().keys({
                calories: Joi.number(),
                sodium: Joi.number(),
                sugar: Joi.number(),
            }),
            diseases: Joi.array().items(Joi.objectId()),
        }),

        patchProductSchema: Joi.object().keys({
            name: Joi.string(),
            barcode: Joi.number(),
            meta: Joi.object().keys({
                calories: Joi.number(),
                sodium: Joi.number(),
                sugar: Joi.number(),
            }),
            diseases: Joi.array().items(Joi.objectId())
        }),

        diseaseSchema: Joi.object().keys({
            name: Joi.string().required(),
        }),

        consumeProductSchema: Joi.object().keys({
            barcode: Joi.number().required(),
            quantity: Joi.number()
        })
    }
}
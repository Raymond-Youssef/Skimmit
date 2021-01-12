const Joi = require('joi');

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
        users: {
            signup: Joi.object().keys({
                email: Joi.string().email().required(),
                name: Joi.string().min(5).max(30).required(),
                // gender: Joi.string().valid('male', 'female'), // TODO: you may add this later
                password: Joi.string().min(8).max(128).required(),
                confirm_password: Joi.string().equal(Joi.ref('password'))
                    .required()
                    .messages({ 'any.only': '{{#label}} does not match' })
            }),

            signin: Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().min(8).max(128).required(),
            }),

            update: Joi.object().keys({
                age: Joi.number().min(15).max(80),
                gender: Joi.string().valid('male', 'female'),
                height: Joi.number().min(50).max(300),
                weight: Joi.number().min(20).max(300),
            }),

            setPassword: Joi.object().keys({
                password: Joi.string().min(8).max(128).required(),
                confirm_password: Joi.string().equal(Joi.ref('password'))
                    .required()
                    .messages({ 'any.only': '{{#label}} does not match' })
            }),

            resetPassword: Joi.object().keys({
                old_password: Joi.string().min(8).max(128).required(),
                new_password: Joi.string().min(8).max(128).required(),
                confirm_password: Joi.string().equal(Joi.ref('new_password'))
                    .required()
                    .messages({ 'any.only': '{{#label}} does not match' })
            }),
        },


        products: {
            create: Joi.object().keys({
                name: Joi.string().required(),
                barcode: Joi.number().required(),
                imageURL: Joi.string().uri(),
                category: Joi.string().valid('canned', 'snacks', 'meals', 'drinks', 'uncategorized'),
                meta: Joi.object().keys({
                    calories: Joi.number(),
                    sugar: Joi.string(),
                    calcium: Joi.string(),
                    iron: Joi.string(),
                    saturated_fat: Joi.string(),
                    trans_fat: Joi.string(),
                    cholesterol: Joi.string(),
                }),
                diseases:Joi.array().unique().items(Joi.string().trim().lowercase().regex(/^[0-9a-fA-F]{24}$/))
            }),

            patch: Joi.object().keys({
                name: Joi.string(),
                barcode: Joi.number(),
                imageURL: Joi.string().uri(),
                category: Joi.string().valid('canned', 'snacks', 'meals', 'drinks', 'uncategorized'),
                meta: Joi.object().keys({
                    calories: Joi.number(),
                    sugar: Joi.string(),
                    calcium: Joi.string(),
                    iron: Joi.string(),
                    saturated_fat: Joi.string(),
                    trans_fat: Joi.string(),
                    cholesterol: Joi.string(),
                }),
                diseases:Joi.array().unique().items(Joi.string().trim().lowercase().regex(/^[0-9a-fA-F]{24}$/))
            }),
        },


        consumption: {
            consume: Joi.object().keys({
                barcode: Joi.number().required(),
                quantity: Joi.number()
            })
        },

        diseaseSchema: Joi.object().keys({
            name: Joi.string().required(),
        }),
    }
}
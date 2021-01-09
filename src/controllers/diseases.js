const {Disease} = require('../models/disease');

module.exports = {
    diseaseID : async (req, res, next, diseaseID) => {
        try {
            const disease = await Disease.findById(diseaseID);
            if (!disease) {
                const err = new Error('disease not found');
                err.status = 404;
                next(err);
            }
            req.disease = disease;
            req.diseaseID = diseaseID;
            next();
        } catch (e) {
            const err = new Error('disease id is invalid')
            err.status = 400;
            next(err);
        }
    },


    readOne: async (req, res) => {
        return res.status(200).json({
            success: true,
            data: req.disease
        });
    },


    readAll: async (req, res) => {
        const diseases = await Disease.find({});
        return res.status(200).json({
            success: true,
            data: diseases,
        })
    },


    create: async (req, res, next) => {
        try{
            const disease = new Disease({name: req.value.body.name});
            await disease.save();
            return res.status(201).json({
                success: true,
                data: disease
            })
        } catch (err) {
            next(err);
        }
    },


    update: async (req, res, next) => {
        try{
            req.disease.name = req.value.body.name;
            req.disease.save();
            res.status(200).json({
                success: true,
                data: req.disease,
            });
        } catch (err) {
            next(err);
        }
    },


    delete: async (req, res, next) => {
        try {
            const disease = await req.disease.remove();
            res.status(200).json({
                success: true,
                deleted: disease,
            });
        } catch (err) {
            next(err);
        }
    }
}
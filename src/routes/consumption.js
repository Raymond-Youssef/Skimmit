const consumptionRouter = require('express').Router();
// const Consume = require('../models/consumption');
// const User = require('../models/user');


// consumptionRouter.get('/',
//     async (req, res, next) => {
//         const newUser = new User({
//             name: "test user",
//             email: "test@test.com"
//         });
//         await newUser.save()
//             .then( async newUser => {
//                 const consumption = new Consume({
//                     date: '2020-1-7',
//                     user: newUser
//                 })
//                 return await consumption.save();
//             })
//             .then( consumption => {
//                 console.log(consumption);
//             })
//     })


module.exports = consumptionRouter;
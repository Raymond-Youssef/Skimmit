const JWT = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;


// Helper function to sign tokens
const signToken = user => {
    return JWT.sign({
        iss: 'mondelez-api',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 7) // Current date + 7 day ahead
    }, JWT_SECRET)
}


// Controllers
module.exports = {
    signUp: async (req, res, next) => {
        const {email, password, name} = req.value.body;
        await User.findOne({email: email})
            .then((foundUser) => {
                // If user exists in database
                if(foundUser) {
                    const err = new Error('user already exists');
                    err.status = 403;
                    throw err;
                }
            })
            .then( async () => {
                // Create new user
                const newUser = new User( {
                    email: email,
                    password: password,
                    name: name,
                })
                // Hash password before saving
                await newUser.hashPassword();
                await newUser.save();
                return newUser;
            })
            .then( (newUser) => {
                // Sign a token
                const token = signToken(newUser);
                // Send response
                return res.status(201).json({
                    success: true,
                    created: {
                        email: newUser.email,
                        name: newUser.name,
                    },
                    token: token,
                })
            })
            .catch( (err) => {
                next(err);
            } )
    },

    signIn: async (req, res) => {
        const token = signToken(req.user);
        return res.status(200).json({
            success: true,
            user: {
                email: req.user.email,
                name: req.user.name,
            },
            token: token,
        })
    },

    googleOAuth: async (req, res, next) => {
        try {
            const token = signToken(req.user);
            return res.status(200).json({
                success: true,
                user: {
                    email: req.user.email,
                    name: req.user.name,
                },
                token: token,
            })
        } catch (err) {
            next(err);
        }
    },

    facebookOAuth: async (req, res, next) => {
        try {
            const token = signToken(req.user);
            return res.status(200).json({
                success: true,
                user: {
                    email: req.user.email,
                    name: req.user.name,
                },
                token: token,
            })
        } catch (err) {
            next(err);
        }
    },

    setPassword: async (req, res, next) => {
        if(req.user.password) {
            const err = new Error('password is already set');
            err.status = 401;
            return next(err);
        }

        req.user.password = req.body.password;
        await req.user.hashPassword();
        req.user.save()
            .then( () => {
                return res.status(200).json({
                    success: true,
                    secret: "password was set"
                })
            })
    },


    resetPassword: async (req, res, next) => {
        try {
            const isMatch = await req.user.isValidPassword(req.value.body.old_password);
            if (!isMatch) {
                const err = new Error('The password is not correct');
                err.status = 401;
                return next(err);
            }
            req.user.password = req.value.body.new_password;
            await req.user.hashPassword();
            await req.user.save();
            return res.status(200).json({
                success: true,
                message: "password was reset successfully",
            });
        } catch (err) {
            next(err);
        }

    }
}
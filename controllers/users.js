const JWT = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;


const signToken = user => {
    return JWT.sign({
        iss: 'mondelez-api',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 7) // Current date + 7 day ahead
    }, JWT_SECRET)
}

module.exports = {
    signUp: async (req, res, next) => {
        const {email, password, name} = req.value.body;
        // Check if the user exists in the database
        const foundUser = await User.findOne({email: email});

        // Handle existing user
        if (foundUser) {
            const err = new Error('user already exists');
            err.status = 403;
            next(err);
        }

        // Create new user
        const newUser = new User({
            email: email,
            password: password,
            name: name,
        });
        await newUser.hashPassword();
        await newUser.save();

        // Sign a new token
        const token = signToken(newUser);

        // Respond with token
        return res.status(201).json({
            success: true,
            created: {
                email: email,
                name: name,
            },
            token: token,
        })
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

    googleOAuth: async (req, res) => {
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

    facebookOAuth: async (req, res) => {
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

    setPassword: async (req, res, next) => {
        if(req.user.password) {
            const err = new Error('password is already set');
            err.status = 401;
            return next(err);
        }

        req.user.password = req.body.password;
        await req.user.hashPassword();
        req.user.save();
        return res.status(200).json({
            success: true,
            secret: "password was set"
        })
    }
}
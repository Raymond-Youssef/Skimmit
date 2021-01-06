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
    signUp: async (req, res) => {
        const {email, password, name} = req.value.body;
        // Check if the user exists in the database
        const foundUser = await User.findOne({"email": email});
        // Handle existing user
        if (foundUser) {
            return res.status(403).json({
                success: false,
                message: "user already exists"
            })
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
        res.status(200).json({
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
        if (req.user.error) {
            return res.status(req.user.error_status).json({
                success: false,
                message: req.user.error,
            });
        }
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

    // facebookOAuth: async (req, res) => {
    //     const token = signToken(req.user);
    //     return res.status(200).json({
    //         success: true,
    //         token: token,
    //     })
    // },
}
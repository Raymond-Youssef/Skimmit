// Passport dependencies
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-token').Strategy;

const User = require('./models/user');

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET;
const googleConfig = {
    CLIENT_ID: process.env["google.CLIENT_ID"],
    CLIENT_SECRET: process.env["google.CLIENT_SECRET"],
}
const facebookConfig = {
    CLIENT_ID: process.env["facebook.CLIENT_ID"],
    CLIENT_SECRET: process.env["facebook.CLIENT_SECRET"],
}

// JWT Strategy
passport.use('JWT-Strategy', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // Find user specified in the token
        const user = await User.findById(payload.sub);

        // If the user doesn't exist, handle it
        if (!user) {
            return done(null, false);
        }

        // otherwise, return the user
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}))

// Local Strategy
passport.use('Local-Strategy', new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({"email": email});

        // If not, handle it
        if (!user) {
            const user_err = {
                error: "The user does not exist",
                error_status: 401
            }
            return done(null, user_err);
        }
        // Check if the password isn't set yet
        if(!user.password) {
            const user_err = {
                error: "The password is not set yet",
                error_status: 401
            }
            return done(null, user_err);
        }

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // If not, handle it
        if (!isMatch) {
            const user_err = {
                error: "The password is not correct",
                error_status: 401
            }
            return done(null, user_err);
        }
        // Otherwise, return the user
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}))


// Google OAuth2.0 Strategy
passport.use('Google-Strategy', new GoogleStrategy({
    clientID: googleConfig.CLIENT_ID,
    clientSecret: googleConfig.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check whether this user exists in the database by GoogleID
        const existingUserByGoogle = await User.findOne({googleID: profile.id});
        if (existingUserByGoogle) {
            return done(null, existingUserByGoogle);
        }

        // Check whether this user exists in the database by Email
        const existingUserByEmail = await User.findOne({email: profile.emails[0].value});
        if (existingUserByEmail) {
            existingUserByEmail.googleID = profile.id;
            existingUserByEmail.save();
            return done(null, existingUserByEmail);
        }

        // If it's not an existing user, create one.
        const newUser = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleID: profile.id,
        });
        await newUser.save();
        done(null, newUser);
    } catch(err) {
        done(err, false, err.message);
    }
}))
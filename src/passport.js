// Passport dependencies
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-token').Strategy;
const FacebookStrategy = require('passport-facebook-token');

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
    await User.findById(payload.sub)
        .then( (user) => {
            // In case user doesn't exist
            if(!user) {
                return done(null, false);
            }
            // In case user does exist
            done(null, user);
        })
        .catch( (err) => {
            done(err, false);
        })
}))


// Local Strategy
passport.use('Local-Strategy', new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    await User.findOne({email: email})
        .then(async (user) => {
            // Case the user does not exist
            if(!user) {
                const err = new Error('The user does not exist');
                err.status = 401;
                throw err;
            }
            // Case user has not set his password yet
            if(!user.password) {
                const err = new Error('The password is not set yet');
                err.status = 401;
                throw err;
            }
            // Case password does not match
            const isMatch = await user.isValidPassword(password);
            if(!isMatch) {
                const err = new Error('The password is not correct');
                err.status = 401;
                throw err;
            }
            // On successful matching
            done(null, user);
        })
        .catch( (err) => {
            // Handling errors
            done(err, false);
        })
}))


// Google OAuth2.0 Strategy
passport.use('Google-Strategy', new GoogleStrategy({
    clientID: googleConfig.CLIENT_ID,
    clientSecret: googleConfig.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    await User.findOne({ googleID: profile.id})
        .then( async (existingUser) => {
            // In case user exists and signed up using google
            if(existingUser) {
                return done(null, existingUser);
            }

            // In case email exists but by email
            const existingUserByEmail = await User.findOne({email: profile.emails[0].value});
            if (existingUserByEmail) {
                existingUserByEmail.googleID = profile.id;
                existingUserByEmail.save();
                return done(null, existingUserByEmail);
            }

            // In case is a new user
            const newUser = new User({
                email: profile.emails[0].value,
                name: profile.displayName,
                googleID: profile.id,
            });
            await newUser.save();
            done(null, newUser);
        })
        .catch( (err) => {
            done(err, false, err.message);
        })
}))


// Facebook Strategy
passport.use('Facebook-Strategy', new FacebookStrategy({
    clientID: facebookConfig.CLIENT_ID,
    clientSecret: facebookConfig.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    await User.findOne({"facebookID": profile.id})
        .then( async (existingUser) => {
            // Check whether this user exists in the database
            if (existingUser) {
                console.log('User exists in database');
                return done(null, existingUser);
            }

            // Check whether this user exists in the database by Email
            const existingUserByEmail = await User.findOne({email: profile.emails[0].value});
            if (existingUserByEmail) {
                existingUserByEmail.facebookID = profile.id;
                existingUserByEmail.save();
                return done(null, existingUserByEmail);
            }

            // Creat new user
            const newUser = new User({
                email: profile.emails[0].value,
                name: profile.displayName,
                facebookID: profile.id,
            });
            await newUser.save();
            done(null, newUser);

        })
        .catch( (err) => {
            done(err, false, err.message);
        })
}))

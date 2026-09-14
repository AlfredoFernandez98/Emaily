const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// Model registered in models/User.js. Read it from Mongoose's registry.
const User = mongoose.model('users');

// Registration only. Passport runs these later:
// login = step 1 -> step 2. Every request after login = step 3.

// STEP 2. Runs when step 1 calls done(). Stores only _id in the cookie.
passport.serializeUser((user,done)=>{
  
  done(null, user.id);


});

// STEP 3. Repeats per request. _id from cookie -> user document on req.user.
passport.deserializeUser((id,done) => {

  User.findById(id)
  .then(user => {
    done(null,user);
  })
  // 3a. DB error goes to Passport, not to an unhandled rejection.
  .catch(err => done(err));
});

// STEP 1. Strategy named 'google', used by passport.authenticate('google').
passport.use(
  new GoogleStrategy(
    {
      // 1a. Credentials from Google API console, kept out of source control.
      clientID: keys.GoogleClientID,
      clientSecret: keys.GoogleClientSecret,
      // 1b. Redirect target. Must match the Google console entry exactly.
      callbackURL: '/auth/google/callback',
    },
    // 1c. Runs after Google redirects back. Maps their profile to our record.
    // Tokens unused: we call no other Google APIs.
    (accessToken, refreshToken, profile, done) => {
      
      // 1d. Check first. Mongo stores duplicate googleId values otherwise.
      User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          // 1e. Returning user. done() hands control to step 2.
          done(null, existingUser);
        } else {
          // 1f. First login. save() is async, so wait before done().
          return new User({ googleId: profile.id }).save().then(user=> done(null,user));
        }
      })
      // 1g. Any DB failure in 1d or 1f goes to Passport, not to an unhandled rejection.
      .catch(err => done(err));
    },
  ),
);

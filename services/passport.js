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
      callbackURL: '/auth/google/callback',
 
      proxy: true,
    },
    // 1c. Runs after Google redirects back. Maps their profile to our record.
    // Tokens unused: we call no other Google APIs.
    async(accessToken, refreshToken, profile, done) => {
      
      
     const existingUser = await User.findOne({ googleId: profile.id });
      
        if (existingUser) {
     
         return done(null, existingUser);
        } 

          const user =  await new User({ googleId: profile.id }).save();
          done(null, user);
        
    }
  ),
);

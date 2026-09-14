const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./services/passport');


// 1. Connect first. Bad URI or unreachable cluster must log, not kill the process.
mongoose
    .connect(keys.mongodbURI)
    .catch(err => console.error('Mongo connection failed:', err.message));

const app = express();

app.use(

    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })

);

// 2. passport 0.6+ calls req.session.regenerate() and .save() on login.
// cookie-session is a stateless cookie and has neither, so stub them.
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => cb();
        req.session.save = (cb) => cb();
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes') (app);

// 4. Last middleware. Catches OAuth and DB errors passed to next().
app.use((err, req, res, next) => {
    console.error('Request failed:', err.message, err.oauthError && err.oauthError.data);
    res.status(500).send('Internal error, see server log');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

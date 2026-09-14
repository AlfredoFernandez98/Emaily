const passport = require('passport');

module.exports = (app) => {

    app.get('/auth/google',
        passport.authenticate(
        'google', {scope: ['profile', 'email']})

    );

    app.get('/auth/google/callback',
        passport.authenticate('google'),
        (rep,res) =>{
            res.redirect('/api/current_user');
        }

    );

    app.get('/api/logout',(req,res,next)=>{
        req.logout(err=>{
            if(err){
                return next(err);
            }
            res.redirect('/');
            printf("User logged out successfully");
        });
    })

    app.get('/api/current_user',(req,res)=>{

        res.send(req.user);
    
    });

};
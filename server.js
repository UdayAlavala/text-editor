const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config;
const config = require('./config')
const app = express();

dotenv();

app.use(
    session({
        secret : config.sessionSecret,
        resave : false,
        saveUninitialized : true
    })
);

app.use(express.static(path.join(__dirname,'views')));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done) => {
    done(null,user);
})

passport.deserializeUser((user,done) => {
    done(null,user);
})

passport.use(
    new GoogleStrategy(
        {
            clientID : process.env.Client_ID,
            clientSecret : process.env.Client_Secret,
            callbackURL : 'http://localhost:3000/auth/google/callback'
        },
        (accessToken,refreshToken,profile,done) => {
            return done(null,profile);
        }
    )
);

app.get('/auth/google', passport.authenticate('google',{scope : ['profile','email']}))
app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect : '/login'}),
    (req,res)=>{
        console.log("authenticated");
        res.send(req.user);
    }
);

app.use('/login',(req,res) => {
    console.log("Request for Login Received");
    res.sendFile(path.join(__dirname,'views','login.html'))
})


app.listen(3000,() => {
    console.log("Server running on PORT 3000")
})
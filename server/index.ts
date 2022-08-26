const express = require('express');
const cors = require("cors");
const {port} = require('./config');
const apiRouter = require('./routes/api');
const auth = require('./routes/auth');
const bodyParser = require('body-parser');
const session = require('express-session');  
const passport = require('passport');  
const connectEnsureLogin = require('connect-ensure-login'); 

const Patient = require('./db/models/user'); 

const app = express();

app.use(cors());
app.use(express.json());

// db
require('./db/mongoose');

// parsers
app.use(bodyParser.json());

// session
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 } // 1 hour
}));

// passport
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(Patient.serializeUser(function(user: any, done: any) {
    if(user) done(null, user);
}));

passport.deserializeUser(function(id: any, done: any) {
    done(null, id);
});
// server
app.listen(port, function() {
    console.log("Backend Application listening at http://localhost:" + port)
});

// routes
app.use('/api', apiRouter);
app.use('/api', auth);

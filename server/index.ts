const express = require('express');
const app = express();
const cors = require("cors");
const {port} = require('./config');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const session = require('express-session');  
const passport = require('passport');  
const connectEnsureLogin = require('connect-ensure-login'); 

const Patient = require('./db/models/patient'); 

app.use(cors());
app.use(express.json());

// db
require('./db/mongoose');

// parsers
// Content-type: application/json
app.use(bodyParser.json());

// routes
app.use('/api', apiRouter);

// session
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(Patient.createStrategy());

passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

// server
app.listen(port, function() {
    console.log("Backend Application listening at http://localhost:" + port)
});


const express = require('express');
const cors = require("cors");
const { port } = require('./config');
const apiRouter = require('./routes/api');
const auth = require('./routes/auth');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
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
    cookie: { maxAge: 5 * 60 * 1000 }    //5min, to-do -> raczej czas sesji nie działa prawidłowo, sama sesja - jest obsługiwana
}));

// passport
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// server
app.listen(port, function () {
    console.log("Backend Application listening at http://localhost:" + port)
});

// routes
app.use('/api', apiRouter);
app.use('/api', auth);
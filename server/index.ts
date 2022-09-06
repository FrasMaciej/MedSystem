import express from 'express';
import bodyParser from 'body-parser';
import { connectToDB } from './db/mongoose';
import { config } from './config';
import apiRouter from './routes/api';
import cors from "cors";
import authApi from "./routes/auth";
import session from "express-session";
import passport from "passport";


const app = express();

app.use(cors());
app.use(express.json());

// db
connectToDB();
// parsers
app.use(bodyParser.json());

// session
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 }
}));

// passport
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// server
app.listen(config.port, function () {
    console.log("Backend Application listening at http://localhost:" + config.port)
});

// routes
app.use('/api', apiRouter);
app.use('/api', authApi);
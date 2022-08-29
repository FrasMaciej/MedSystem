import { Request, Response } from 'express';
import { UserI } from './interfaces';

const User = require('../db/models/user'); 
const express = require('express');
const router = express.Router();
const passport = require('passport');  
const connectEnsureLogin = require('connect-ensure-login');

passport.use(User.createStrategy());

passport.serializeUser(function(user: any, done: any) {
    if(user) done(null, user);
});
passport.deserializeUser(function(id: any, done: any) {
    done(null, id);
});

const auth = () => {
    return (req: any, res: any, next: any) => {
        passport.authenticate('local', (error: any, user: any, info: any) => {
            if(error) res.status(400).json({"statusCode" : 200 ,"message" : error});
            req.login(user, function(error: any) {
                if (error) return next(error);
                next();
            });
        })(req, res, next);
    }
}

router.post('/user/login', auth() , (req: any, res: any) => {
    res.status(200).json({"statusCode" : 200 ,"user" : req.user});
});

const isLoggedIn = (req: any, res: any, next: any) => {
    console.log('session ', req.session);
    if(req.isAuthenticated()){
        console.log('user ', req.session.passport.user)
        return next()
    }
    return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}

router.get('/getData', isLoggedIn, (req: any, res: any) => {
    res.json("data is")
})

router.post('/user/register', (req: Request, res: Response) => {
    const {username, name, surname, password, role } = req.body;
    const newUser: UserI = { username, name, surname, role };
    User.register(newUser, password, function(err: any, user: UserI){
        if(err) {console.log(err); res.redirect("/api")}
        else {
            console.log(user);
            passport.authenticate("local")(req, res, () => res.redirect("/"));
        }
    });
});


export { };
module.exports = router;
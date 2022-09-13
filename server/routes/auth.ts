import { Request, Response } from 'express';
import express from "express";
import passport from 'passport';
import { UserI } from '../shared/user';
import { User } from '../db/models/user';
import { Doctor } from '../db/models/doctor';

const authApi = express.Router();

passport.use(User.createStrategy());

passport.serializeUser(function (user: any, done: any) {
    if (user) done(null, user);
});
passport.deserializeUser(function (id: any, done: any) {
    done(null, id);
});

const auth = () => {
    return (req: any, res: any, next: any) => {
        passport.authenticate('local', (error: any, user: any, info: any) => {
            if (error) res.status(400).json({ "statusCode": 200, "message": error });
            req.login(user, function (error: any) {
                if (error) return next(error);
                next();
            });
        })(req, res, next);
    }
}

authApi.post('/user/login', auth(), async (req: any, res: any) => {
    res.status(200).json({ "statusCode": 200, "user": req.user });
});

authApi.post('/user/register', (req: Request, res: Response) => {
    const { username, name, surname, password, role, city } = req.body;
    const newUser: UserI = { username, name, surname, role, city };
    if (password.length < 6) {
        return res.redirect("/api");
    }
    User.register(newUser, password, function (err: any, user: UserI) {
        if (err) { console.log(err); res.redirect("/api") }
        else {
            if (role === "Doctor") {
                const doctor = new Doctor({ name, surname, city });
                if (user._id !== undefined) {
                    doctor.userId = user._id;
                }
                doctor.save();
            }
            passport.authenticate('local', { failureRedirect: '/api', failureMessage: true }, function (req, res) {
                return res.status(201);
            })
        }
    });
});

const isLoggedIn = (req: any, res: any, next: any) => {
    console.log('session ', req.session);
    if (req.isAuthenticated()) {
        console.log('user ', req.session.passport.user)
        return next()
    }
    return res.status(400).json({ "statusCode": 400, "message": "not authenticated" })
}

export default authApi;
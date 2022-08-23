// export const Patient = require('../../db/models/patient');
const Patient = require('../../db/models/patient');
import { Request, Response } from 'express';
import { Patient } from './interfaces';
const passport = require('passport');  // authentication


class PatientActions {
    login(req: Request, res: Response) {
        res.redirect('/api/doctors');
    }

    register(req: Request, res: Response) {
        const newPatient: Patient = {
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname
        }
        Patient.register(newPatient, req.body.password, function(err: any, patient: Patient){
            if(err) {console.log(err); res.redirect("/api")}
            else {
                console.log(patient);
                passport.authenticate("local")(req, res, () => res.redirect("/"));
            }
        });
    }
}

module.exports = new PatientActions()

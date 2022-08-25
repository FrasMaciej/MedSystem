// export const Patient = require('../../db/models/patient');
const Patient = require('../../db/models/patient');
import { doesNotMatch } from 'assert';
import { Request, Response } from 'express';
import { Patient } from './interfaces';
const passport = require('passport');  


class PatientActions {
    login(req: Request, res: Response) {
        res.redirect('/patientPage');
    }

    register(req: Request, res: Response) {
        const {username, name, surname, password } = req.body;
        const newPatient: Patient = { username, name, surname };
        Patient.register(newPatient, password, function(err: any, patient: Patient){
            if(err) {console.log(err); res.redirect("/api")}
            else {
                console.log(patient);
                passport.authenticate("local")(req, res, () => res.redirect("/"));
            }
        });
    }
}

module.exports = new PatientActions()

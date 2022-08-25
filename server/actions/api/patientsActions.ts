// export const Patient = require('../../db/models/patient');
const Patient = require('../../db/models/patient');
import { doesNotMatch } from 'assert';
import { Request, Response } from 'express';
import { Patient } from './interfaces';


class PatientActions {
    login(req: Request, res: Response) {
        res.redirect('/api/doctors');
    }

    register(req: Request, res: Response) {
        // CR:KR 
        // Wiem że wjechałam na serwer i trochę poza mój obszar, ale tutaj mogę sprzedać kilka fajnych patentów
        // można wykorzystać coś takiego jak https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        // const {username, name, surname, password } = req.body;
        // a potem skrótowy zapis
        // const newPatient: Patient = { username, name, surname };
        // bo { username: username } <=> { username }

        // tylko z tym oczywiście trzeba uważać jakby np. req.body miało być undefined 
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

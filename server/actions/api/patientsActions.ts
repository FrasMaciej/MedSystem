// export const Patient = require('../../db/models/patient');
const Patient = require('../../db/models/patient');
import { Request, Response } from 'express';


class PatientActions {
    login(req: Request, res: Response) {
        res.redirect('/api/doctors');
    }

    register(req: Request, res: Response) {
        const username: String = req.body.username;
        const password: String = req.body.password;
        Patient.register({username: username, active: false}, password);
    }
}

module.exports = new PatientActions()

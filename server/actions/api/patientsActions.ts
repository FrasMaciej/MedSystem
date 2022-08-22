export const Patient = require('../../db/models/patient');
import { Request, Response } from 'express';


class PatientActions {
    login(req: Request, res: Response) {
        res.redirect('/api/doctors');
    }
}

module.exports = new PatientActions()

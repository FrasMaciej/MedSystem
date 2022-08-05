import { notEqual } from "assert";

const Doctor = require('../../db/models/doctor');

class DoctorActions {


    async getAllDoctors(req: any, res: any){
        let doc;
        try {
            doc = await Doctor.find({});
        } catch (err: any) {
            return res.status(500).json({message: err.message});
        }

        console.log(doc);
        res.status(200).json(doc);
    }

    //pobieranie lekarza
    async getDoctor(req: any, res: any){
        const id = req.params.id;
        const doctor = await Doctor.findOne({ _id: id });
        res.status(200).json(doctor);
    }

    async saveDoctor(req: any, res: any){
        const name = req.body.name;
        const surname = req.body.surname;

        let doctor;

        try {
            doctor = new Doctor({name,surname});
            await doctor.save();
        } catch (err: any) {
            return res.status(422).json({message: err.message});
        }

        res.status(201).json(doctor);
    }

    async addSpecialization(req: any, res: any){
        const id = req.params.id;
        const specialization = req.body.specialization;

        const doctor = await Doctor.findOne({_id: id});
        doctor.specializations.push(specialization);
        await doctor.save();

        res.status(201).json(doctor);
    }
    
    async updateDoctor(req: any, res: any){
        const id = req.params.id;
        const name = req.body.name;
        const surname = req.body.surname;
        const specializations = req.body.specializations;

        const doctor = await Doctor.findOne({_id: id});
        doctor.name = name;
        doctor.surname = surname;
        doctor.specializations = specializations;
        await doctor.save();

        res.status(201).json(doctor);
    }

    async deleteDoctor(req: any, res: any){
        const id = req.params.id;
        await Doctor.deleteOne({ _id: id });

        res.sendStatus(204);
    }
}

module.exports = new DoctorActions()
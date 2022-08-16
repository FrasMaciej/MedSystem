import { Visit, Schedule, DoctorI } from './interfaces';
import { Request, Response } from 'express';


const Doctor = require('../../db/models/doctor');


class DoctorActions {

    async getAllDoctors(req: Request, res: Response) {
        try {
            const doc = await Doctor.find({});
            return res.status(200).json(doc);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doc = await Doctor.findOne({ _id: id });
            res.status(200).json(doc)
        } catch (err: any) {
            return res.status(500).json({message: err.message});
        }
    }
    
    async saveDoctor(req: Request, res: Response) {
        const name = req.body.name;
        const surname = req.body.surname;
        const city = req.body.city;
        try {
            const doctor = new Doctor({ name, surname, city });
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({message: err.message});
        }
    }

    async addSpecialization(req: Request, res: Response) {
        const id = req.params.id;
        const specialization = req.body.specialization;
        try {
            const doctor = await Doctor.findOne({_id: id});
            doctor.specializations.push(specialization);
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({message: err.message});
        }
    }
    
    async addTerminsSlots(req: Request, res: Response) {
        const id = req.params.id;
        const singleVisitTime: number = Number(req.body.singleVisitTime);
        
        const scheduleDate: Date = new Date(req.body.scheduleDate);
        const finishHour: Date = new Date(req.body.finishHour);

        try {
            const doctor = await Doctor.findOne({_id: id});
            const schedule: Schedule = {
                scheduleDate: new Date(scheduleDate),
                finishHour: new Date(finishHour),
                singleVisitTime: singleVisitTime,
                visits: [],
            };

            const scheduleIndex: number = doctor.schedule.push(schedule)-1;
            const timeDif: number = doctor.schedule[scheduleIndex].finishHour-doctor.schedule[scheduleIndex].scheduleDate;
            
            let loop: Date = new Date(scheduleDate);
            let end: Date = new Date(finishHour);

            while(loop < end){
                const visit: Visit = {
                    startHour: new Date(loop),
                    finishHour: new Date(loop.setMinutes(loop.getMinutes() + singleVisitTime)),
                    isFree: true,
                    patientInfo: {
                        name: '',
                        surname: ''
                    },
                    visitNote: '',
                };
                doctor.schedule[scheduleIndex].visits.push(visit);
            }    
            
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({message: err.message});
        }
    }

    async updateDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doctor = await Doctor.findOne({_id: id});
            doctor.name = req.body.name;
            doctor.surname = req.body.surname;
            doctor.city = req.body.city;
            doctor.specializations = req.body.specializations;
            doctor.schedule = req.body.schedule;
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({message: err.message});
        }
    }

    async deleteDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            await Doctor.deleteOne({ _id: id });
            res.sendStatus(204);
        } catch (err: any) {
            res.sendStatus(404).json({message: err.message});
        }
    }

    //To-do -> uprościć!
    async editVisit(req: Request, res: Response) {
        const doctorId = req.params.doctorId;
        const scheduleId = req.params.scheduleId;
        const visitId = req.params.visitId;
        const visitNote = req.body.visitNote;
        const isFree = req.body.isFree;
        const name = req.body.patientInfo.name;
        const surname = req.body.patientInfo.surname;
        let scheduleIndex: number = 0;
        let visitIndex: number = 0;
        let doctor;

        try {
            doctor = await Doctor.findOne({ _id: doctorId });
        } catch (err: any) {
            return res.status(500).json({message: err.message});
        }
        
        for(let i=0; i<doctor.schedule.length; i++){
            if(doctor.schedule[i]._id.toString() === scheduleId){
                scheduleIndex = i;
                break;
            }
            else continue
        }

        for(let i=0; i<doctor.schedule[scheduleIndex].visits.length; i++){
            if(doctor.schedule[scheduleIndex].visits[i]._id.toString() === visitId){
                visitIndex = i;
                break;
            }
            else continue
        }

        doctor.schedule[scheduleIndex].visits[visitIndex].isFree = isFree;
        doctor.schedule[scheduleIndex].visits[visitIndex].visitNote = visitNote;
        doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.name = name;
        doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.surname = surname;
    
        if(doctor.schedule[scheduleIndex].visits[visitIndex].isFree===true){
            doctor.schedule[scheduleIndex].visits[visitIndex].visitNote = '';
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.name = null
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.surname = null
        }
        
        await doctor.save();
        res.status(201).json(doctor);
    }
}

module.exports = new DoctorActions()
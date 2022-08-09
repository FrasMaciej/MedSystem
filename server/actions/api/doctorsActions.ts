import { notEqual } from "assert";
import { Schema } from "mongoose";

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
        const city = req.body.city;

        let doctor;

        try {
            doctor = new Doctor({name,surname,city});
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
    
    // TO_DO !!!
    async addTerminsSlots(req: any, res: any){
        var json;
        var dateStr;
        let id = req.params.id;
        let singleVisitTime = req.body.singleVisitTime;

        // Wyciągnięcie daty startowej z JSON-a
        json = req.body.scheduleDate;
        dateStr = JSON.parse(json);
        let scheduleDate = new Date(dateStr);

        // Wyciągnięcie godziny końcowej z JSON-a
        json = req.body.finishHour;
        dateStr = JSON.parse(json);
        let finishHour = new Date(dateStr);

        // Wyciągnięcie dotychczasowych danych lekarza
        let doctor = await Doctor.findOne({_id: id});

        // Utworzenie pomocniczego schema dla grafiku

        var visitSchema = new Schema ({
            startHour: Date,
            finishHour: Date,
            isFree: Boolean,
            patientInfo:{
                name: String,
                surname: String
            },
            visitNote: String
        })

        const scheduleSchema = new Schema ({
            scheduleDate: Date,
            finishHour: Date,
            singleVisitTime: Number,
            visits: [{
                startHour: Date,
                finishHour: Date,
                isFree: Boolean,
                patientInfo:{
                    name: String,
                    surname: String
                },
                visitNote: String
            }]
        })
        //

        var scheduleIndex: number = doctor.schedule.push(scheduleSchema)-1;
        doctor.schedule[scheduleIndex].scheduleDate = new Date(scheduleDate);
        doctor.schedule[scheduleIndex].finishHour = new Date(finishHour)
        doctor.schedule[scheduleIndex].singleVisitTime = singleVisitTime;
        
        let start: Date = scheduleDate;
        start.setSeconds(0);
        let end: Date = finishHour;
        finishHour.setSeconds(0);
        let loop: Date = start;
        let _loop: Date;
        var listIndex; 
        while(loop < end){
            listIndex = doctor.schedule[scheduleIndex].visits.push(visitSchema)-1;
            _loop = new Date(loop);
            doctor.schedule[scheduleIndex].visits[listIndex].startHour = _loop;
            loop.setMinutes(loop.getMinutes() + singleVisitTime);
            _loop = new Date(loop);
            doctor.schedule[scheduleIndex].visits[listIndex].finishHour = _loop;
        }

        await doctor.save();
        res.status(201).json(doctor);

    }

    async updateDoctor(req: any, res: any){
        const id = req.params.id;
        const name = req.body.name;
        const surname = req.body.surname;
        const city = req.body.city;
        const specializations = req.body.specializations;
        const schedules = req.body.schedule;

        const doctor = await Doctor.findOne({_id: id});
        doctor.name = name;
        doctor.surname = surname;
        doctor.city = city;
        doctor.specializations = specializations;
        doctor.schedule = schedules;
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
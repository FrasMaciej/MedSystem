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
        const scheduleSchema = new Schema ({
            scheduleDate: Date,
            finishHour: Date,
            singleVisitTime: Number,
            visits:[{
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
        var index: number = doctor.schedule.push(scheduleSchema)-1;
        doctor.schedule[index].scheduleDate = scheduleDate;
        doctor.schedule[index].finishHour = finishHour
        doctor.schedule[index].singleVisitTime = singleVisitTime;
        
        // let visit = {
        //     startHour: req.body.startingDateHour,
        //     finishHour: req.body.endingHour,
        //     isFree: Boolean = false,
        //     patientInfo: patientInfo,
        //     visitNote: String
        // }

        // let newSchedule = {
        //     scheduleDate: Date = req.body.startingDateHour,
        //     finishHour: Date = req.body.endingHour,
        //     singleVisitTime: Number = slotTime,
        //     visits: [visit]
        // };
        
        // let start: Date = startingDate;
        // //start.setSeconds(0);
        // let end: Date = endingHour;
        // //endingHour.setSeconds(0);
        // let loop: Date = start;

        // while(loop < end){
        //     visit.startHour = loop;
        //     loop.setMinutes(loop.getMinutes() + slotTime)
        //     visit.finishHour = loop;
        //     visit.isFree = true;
        //     visit.patientInfo.name = '';
        //     visit.patientInfo.surname = '';
        //     visit.visitNote = '';
        //     newSchedule.visits.push(visit);
        // }

        // newSchedulesList.push(newSchedule);
        // doctor.schedule = newSchedulesList;
        await doctor.save();
        res.status(201).json(doctor);
    }

    async updateDoctor(req: any, res: any){
        const id = req.params.id;
        const name = req.body.name;
        const surname = req.body.surname;
        const city = req.body.city;
        const specializations = req.body.specializations;

        const doctor = await Doctor.findOne({_id: id});
        doctor.name = name;
        doctor.surname = surname;
        doctor.city = city;
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
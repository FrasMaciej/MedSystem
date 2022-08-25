import { Visit, Schedule, DoctorI, VisitInfo } from './interfaces';
import { Request, Response } from 'express';


const Doctor = require('../../db/models/doctor');


class DoctorActions {

    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await Doctor.find({});
            doctors.sort((a: DoctorI, b: DoctorI) => (a.surname < b.surname ? -1 : 1));
            return res.status(200).json(doctors);
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
                _id: id
            };

            const scheduleIndex: number = doctor.schedule.push(schedule)-1;            
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
            // CR-KR Analogicznie jak we wcześniejszym przykładnie, ja bym to skróciła tutaj tak:
            // const { name, surname, city, specializations, schedule } = req.body;
            // const doctorDB = await Doctor.findOne({_id: id});
            // const doctor = {...doctorDb, name, surname, city, specializations, schedule }
            
            // oczywiście powyższy zapis nie jest zły, chciałam tylko pokazać inne możliwości :)
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
        // CR-KR 
        // Tutaj ten kod wyżej aż błaga żeby zrobić destructure :)
        let scheduleIndex: number = 0;
        let visitIndex: number = 0;
        let doctor;


        try {
            doctor = await Doctor.findOne({ _id: doctorId });
        } catch (err: any) {
            return res.status(500).json({message: err.message});
        }

        // CR-KR Tutaj w JS są bardzo fajne metody na tablicach polecam używać gdzie się da
        // taka ciekawostka że u nas w kodzie bardzo ciężko jest znaleźć zwykłą pętlę for czy while :)
        // no i też muszę tradycyjnie zareklamować na przyszłość https://github.com/marcinnajder/powerseq :)
        // to bym zapisała jako:
        // const scheduleIndex = doctor.schedule.findIndex(s => s._id.toString() === scheduleId)

        for(let i=0; i<doctor.schedule.length; i++){
            if(doctor.schedule[i]._id.toString() === scheduleId){
                scheduleIndex = i;
                break;
            }
            else continue
        }

        // const visitIndex = doctor.schedule[scheduleIndex].visits.findIndex(v => v._id.toString() === visitId)
        for(let i=0; i<doctor.schedule[scheduleIndex].visits.length; i++){
            if(doctor.schedule[scheduleIndex].visits[i]._id.toString() === visitId){
                visitIndex = i;
                break;
            }
            else continue
        }
        // CR-KR
        // tutaj też by mozna było to zapisać krócej:
        // doctor.schedule[scheduleIndex].visits[visitIndex] = {
        //  ...doctor.schedule[scheduleIndex].visits[visitIndex],
        //  isFree, visitNote, name, surname
        //}
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

    async getSpecs(req: Request, res: Response) {
        try {
            const doctors: DoctorI[] = await Doctor.find({});
            let specs = new Set();
            doctors.map(doc => doc.specializations
                   .map(spec => specs.add(spec)));
            return res.status(200).json(Array.from(specs));
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getCities(req: Request, res: Response) {
        try {
            const doctors: DoctorI[] = await Doctor.find({});
            let cities = new Set();
            doctors.map(doc => cities.add(doc.city));
            return res.status(200).json(Array.from(cities));
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getFilteredVisits(req: Request, res: Response) {
        try {
            const doctors: DoctorI[] = await Doctor.find({});
            const specialization: String = req.body.specialization;
            const cities = Array.from(req.body.cities);
            const startDate: Date = new Date(req.body.startDate);
            const endDate: Date = new Date(req.body.endDate);
            let matchingVisits: VisitInfo[] = []; 
            let datesArray: Date[] = [];
            let loop = new Date(startDate);

            while(loop <= endDate) {
                datesArray.push(new Date(loop));
                loop.setDate(loop.getDate()+1);
            }
            
            let matchingDoctors: DoctorI[] = doctors.filter(doc => (doc.specializations.indexOf(specialization) > -1 && cities.indexOf(doc.city) > -1));
            matchingDoctors.map(doc => doc.schedule
                            .map(sch => {
                            for(let date of datesArray) {
                                if((date.getDate() === sch.scheduleDate.getDate()) && (date.getMonth() === sch.scheduleDate.getMonth()) && (date.getFullYear === sch.scheduleDate.getFullYear)) {
                                    sch.visits.filter(visit => { 
                                    if(visit.isFree) { 
                                        let visitInfo: VisitInfo = {
                                            doctorId: doc._id,
                                            scheduleId: sch._id,
                                            visit: visit,
                                            docSpecialization: specialization,
                                            docName: doc.name,
                                            docSurname: doc.surname,
                                            docCity: doc.city
                                        }
                                        matchingVisits.push(visitInfo); 
                                    } })
                                }
                            }
                        }
                        ));

            matchingVisits.sort((a: VisitInfo, b: VisitInfo) => (a.visit.startHour < b.visit.finishHour ? -1 : 1));
            res.status(201).json(matchingVisits);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

}

module.exports = new DoctorActions()



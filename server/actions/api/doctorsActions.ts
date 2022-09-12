import { DoctorI } from '../../shared/doctor';
import { VisitI, ScheduleI, VisitInfoI } from '../../shared/schedule'
import { Request, Response } from 'express';
import { pipe, flatmap, orderby, map, filter, toarray, distinct } from "powerseq";
import { Doctor } from '../../db/models/doctor';
import * as functions from './functions';


export const DoctorActions = {
    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await Doctor.find({});
            doctors.sort((a: DoctorI, b: DoctorI) => (a.surname < b.surname ? -1 : 1));
            return res.status(200).json(doctors);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async getSpecs(req: Request, res: Response) {
        try {
            const doctors: DoctorI[] = await Doctor.find({});
            const uniqueSpecs = pipe(doctors, flatmap(doc => doc.specializations), distinct(), toarray());
            return res.status(200).json(uniqueSpecs);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async getCities(req: Request, res: Response) {
        try {
            const doctors: DoctorI[] = await Doctor.find({});
            let cities = new Set();
            doctors.map(doc => cities.add(doc.city));
            return res.status(200).json(Array.from(cities));
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async getFilteredVisits(req: Request, res: Response) {
        const specialization: string = req.body.specialization;
        const cities = Array.from(req.body.cities);
        const startDate: Date = new Date(req.body.startDate);
        const endDate: Date = new Date(req.body.endDate);

        try {
            const doctors: DoctorI[] = await Doctor.find({});
            let matchingDoctors: DoctorI[] = doctors.filter(doc => (doc.specializations.indexOf(specialization) > -1 && cities.indexOf(doc.city) > -1));
            var matchingVisits = pipe(
                matchingDoctors,
                flatmap(doc => doc.schedule, (doc, sch) => ({ doc, sch })),
                filter(({ sch }) => sch.scheduleDate >= startDate && sch.scheduleDate <= endDate),
                flatmap(({ sch }) => sch.visits, ({ doc, sch }, visit) => ({ doc, sch, visit })),
                filter(({ visit }) => visit.isFree.valueOf() === true),
                orderby(({ visit }) => visit.startHour),
                map(({ doc, sch, visit }) => ({
                    doctorId: doc._id,
                    scheduleId: sch._id,
                    visit: visit,
                    docSpecialization: specialization,
                    docName: doc.name,
                    docSurname: doc.surname,
                    docCity: doc.city
                }) as VisitInfoI),
                toarray()
            )
            res.status(201).json(matchingVisits);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async getVisitsByPatientId(req: Request, res: Response) {
        const patientId = req.params.id;
        let matchingVisits: VisitInfoI[] = [];

        try {
            const doctors: DoctorI[] = await Doctor.find({});
            doctors.map(d => d.schedule
                .map(s => s.visits
                    .filter(v => {
                        if (v.patientInfo.patientId === patientId && s._id) {
                            let visitInfo: VisitInfoI = {
                                doctorId: d._id,
                                scheduleId: s._id,
                                visit: v,
                                docName: d.name,
                                docSurname: d.surname,
                                docCity: d.city
                            }
                            matchingVisits.push(visitInfo);
                        }
                    })));
            matchingVisits.sort((a: VisitInfoI, b: VisitInfoI) => (a.visit.startHour < b.visit.finishHour ? -1 : 1));
            res.status(201).json(matchingVisits);
        }
        catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async getDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doc = await Doctor.findOne({ _id: id });
            res.status(200).json(doc)
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async getDoctorByUserId(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doc = await Doctor.findOne({ userId: id });
            res.status(200).json(doc);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    },

    async saveDoctor(req: Request, res: Response) {
        const { name, surname, city } = req.body;
        try {
            const doctor = new Doctor({ name, surname, city });
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    },

    async addSpecialization(req: Request, res: Response) {
        const id = req.params.id;
        const specialization = req.body.specialization;
        try {
            const doctor = await Doctor.findOne({ _id: id });
            if (doctor !== null) {
                doctor.specializations.push(specialization);
                await doctor.save();
            }
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    },

    async addTerminsSlots(req: Request, res: Response) {
        const id = req.params.id;
        const singleVisitTime: number = Number(req.body.singleVisitTime);
        const scheduleDate: Date = new Date(req.body.scheduleDate);
        const finishHour: Date = new Date(req.body.finishHour);

        try {
            const doctor = await Doctor.findOne({ _id: id });
            const schedule: ScheduleI = {
                scheduleDate: new Date(scheduleDate),
                finishHour: new Date(finishHour),
                singleVisitTime: singleVisitTime,
                visits: [],
            };

            if (doctor !== null) {
                let loop: Date = new Date(scheduleDate);
                let end: Date = new Date(finishHour);

                while (loop < end) {
                    const visit: VisitI = {
                        startHour: new Date(loop),
                        finishHour: functions.addMinutes(loop, singleVisitTime),
                        isFree: true,
                        patientInfo: {
                            name: '',
                            surname: '',
                            patientId: ''
                        },
                        visitNote: '',
                    };
                    schedule.visits.push(visit);
                }
                doctor.schedule.push(schedule);
                await doctor.save();
                res.status(201).json(doctor);
            }
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    },

    async updateDoctor(req: Request, res: Response) {
        const id = req.params.id;
        const { name, surname, city, specializations, schedule } = req.body;
        try {
            const doctor = await Doctor.findOne({ _id: id });
            if (doctor !== null) {
                doctor.name = name;
                doctor.surname = surname;
                doctor.city = city;
                doctor.specializations = specializations;
                doctor.schedule = schedule;
                await doctor.save();
            }
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    },

    async deleteDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            await Doctor.deleteOne({ _id: id });
            res.sendStatus(204);
        } catch (err: any) {
            res.sendStatus(404).json({ message: err.message });
        }
    },

    async editVisit(req: Request, res: Response) {
        const { doctorId, scheduleId, visitId } = req.params;
        const { visitNote, isFree } = req.body.visit;
        const { name, surname } = req.body.visit.patientInfo
        const patientId = req.body.patientId;
        let doctor;

        try {
            doctor = await Doctor.findOne({ _id: doctorId });
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }

        if (doctor !== null) {
            const matchingSchedule = doctor.schedule.find(s => s._id?.toString() === scheduleId);
            const scheduleIndex: number = matchingSchedule ? doctor.schedule.indexOf(matchingSchedule) : 0;
            const matchingVisit = doctor.schedule[scheduleIndex].visits.find(v => v._id?.toString() === visitId);

            if (matchingVisit !== undefined) {
                matchingVisit.isFree = isFree;
                matchingVisit.visitNote = visitNote;
                matchingVisit.patientInfo.name = name;
                matchingVisit.patientInfo.surname = surname;
                if (patientId !== '' && patientId !== null && patientId !== undefined) {
                    matchingVisit.patientInfo.patientId = patientId;
                }

                if (matchingVisit.isFree === true) {
                    matchingVisit.visitNote = '';
                    matchingVisit.patientInfo.name = '';
                    matchingVisit.patientInfo.surname = '';
                    matchingVisit.patientInfo.patientId = '';
                }
            }
            console.log(matchingVisit);
            await doctor.save();
        }
        res.status(201).json(doctor);
    }
}

import { VisitI, DoctorI, VisitInfoI } from '../../models';
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
        const specialization: string = req.body.specialization;
        const cities = Array.from(req.body.cities);
        const startDate: Date = new Date(req.body.startDate);
        const endDate: Date = new Date(req.body.endDate);
        let matchingVisits: VisitInfoI[] = [];
        let datesArray: Date[] = [];
        let loop = new Date(startDate);
        try {
            const doctors: DoctorI[] = await Doctor.find({});

            while (loop <= endDate) {
                datesArray.push(new Date(loop));
                loop.setDate(loop.getDate() + 1);
            }

            let matchingDoctors: DoctorI[] = doctors.filter(doc => (doc.specializations.indexOf(specialization) > -1 && cities.indexOf(doc.city) > -1));
            matchingDoctors.map(doc => doc.schedule
                .map(sch => {
                    for (let date of datesArray) {
                        if ((date.getDate() === sch.scheduleDate.getDate()) && (date.getMonth() === sch.scheduleDate.getMonth()) && (date.getFullYear === sch.scheduleDate.getFullYear)) {
                            sch.visits.filter(visit => {
                                if (visit.isFree) {
                                    let visitInfo: VisitInfoI = {
                                        doctorId: doc._id,
                                        scheduleId: sch._id,
                                        visit: visit,
                                        docSpecialization: specialization,
                                        docName: doc.name,
                                        docSurname: doc.surname,
                                        docCity: doc.city
                                    }
                                    matchingVisits.push(visitInfo);
                                }
                            })
                        }
                    }
                }
                ));

            matchingVisits.sort((a: VisitInfoI, b: VisitInfoI) => (a.visit.startHour < b.visit.finishHour ? -1 : 1));
            res.status(201).json(matchingVisits);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getVisitsByPatientId(req: Request, res: Response) {
        const patientId = req.params.id;
        let matchingVisits: VisitInfoI[] = [];

        try {
            const doctors: DoctorI[] = await Doctor.find({});
            doctors.map(d => d.schedule
                .map(s => s.visits
                    .filter(v => {
                        if (v.patientInfo.patientId === patientId) {
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
    }

    async getDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doc = await Doctor.findOne({ _id: id });
            res.status(200).json(doc)
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getDoctorByUserId(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doc = await Doctor.findOne({ userId: id });
            res.status(200).json(doc);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async saveDoctor(req: Request, res: Response) {
        const { name, surname, city } = req.body;
        try {
            const doctor = new Doctor({ name, surname, city });
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    }

    async addSpecialization(req: Request, res: Response) {
        const id = req.params.id;
        const specialization = req.body.specialization;
        try {
            const doctor = await Doctor.findOne({ _id: id });
            doctor.specializations.push(specialization);
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    }

    async addTerminsSlots(req: Request, res: Response) {
        const id = req.params.id;
        const singleVisitTime: number = Number(req.body.singleVisitTime);

        const scheduleDate: Date = new Date(req.body.scheduleDate);
        const finishHour: Date = new Date(req.body.finishHour);

        try {
            const doctor = await Doctor.findOne({ _id: id });
            const schedule = {
                scheduleDate: new Date(scheduleDate),
                finishHour: new Date(finishHour),
                singleVisitTime: singleVisitTime,
                visits: [],
            };

            const scheduleIndex: number = doctor.schedule.push(schedule) - 1;
            let loop: Date = new Date(scheduleDate);
            let end: Date = new Date(finishHour);

            while (loop < end) {
                const visit: VisitI = {
                    startHour: new Date(loop),
                    finishHour: new Date(loop.setMinutes(loop.getMinutes() + singleVisitTime)),
                    isFree: true,
                    patientInfo: {
                        name: '',
                        surname: '',
                        patientId: ''
                    },
                    visitNote: '',
                };
                doctor.schedule[scheduleIndex].visits.push(visit);
            }

            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    }

    async updateDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doctor = await Doctor.findOne({ _id: id });
            doctor.name = req.body.name;
            doctor.surname = req.body.surname;
            doctor.city = req.body.city;
            doctor.specializations = req.body.specializations;
            doctor.schedule = req.body.schedule;
            await doctor.save();
            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    }

    async deleteDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            await Doctor.deleteOne({ _id: id });
            res.sendStatus(204);
        } catch (err: any) {
            res.sendStatus(404).json({ message: err.message });
        }
    }

    async editVisit(req: Request, res: Response) {
        const doctorId = req.params.doctorId;
        const scheduleId = req.params.scheduleId;
        const visitId = req.params.visitId;
        const visitNote = req.body.visit.visitNote;
        const isFree = req.body.visit.isFree;
        const name = req.body.visit.patientInfo.name;
        const surname = req.body.visit.patientInfo.surname;
        const patientId = req.body.patientId;

        let doctor;

        try {
            doctor = await Doctor.findOne({ _id: doctorId });
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }

        let scheduleIndex: number = doctor.schedule.indexOf(doctor.schedule.find((sch: { _id: string; }) => sch._id.toString() === scheduleId))
        let visitIndex: number = doctor.schedule[scheduleIndex].visits.indexOf(doctor.schedule[scheduleIndex].visits.find((vst: { _id: string; }) => vst._id.toString() === visitId))

        doctor.schedule[scheduleIndex].visits[visitIndex].isFree = isFree;
        doctor.schedule[scheduleIndex].visits[visitIndex].visitNote = visitNote;
        doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.name = name;
        doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.surname = surname;
        if (patientId !== '' && patientId !== null && patientId !== undefined) {
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.patientId = patientId;
        }

        if (doctor.schedule[scheduleIndex].visits[visitIndex].isFree === true) {
            doctor.schedule[scheduleIndex].visits[visitIndex].visitNote = '';
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.name = null
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.surname = null
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.patientId = null
        }

        await doctor.save();
        res.status(201).json(doctor);
    }
}

module.exports = new DoctorActions()

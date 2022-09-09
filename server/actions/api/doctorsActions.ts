import { DoctorI } from '../../shared/doctor';
import { VisitI, ScheduleI, VisitInfoI } from '../../shared/schedule'
import { Request, Response } from 'express';
import { pipe, flatmap, orderby, map, filter, toarray, distinct } from "powerseq";
import { Doctor } from '../../db/models/doctor';

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
            }

            res.status(201).json(doctor);
        } catch (err: any) {
            return res.status(422).json({ message: err.message });
        }
    },

    async updateDoctor(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const doctor = await Doctor.findOne({ _id: id });
            if (doctor !== null) {
                doctor.name = req.body.name;
                doctor.surname = req.body.surname;
                doctor.city = req.body.city;
                doctor.specializations = req.body.specializations;
                doctor.schedule = req.body.schedule;
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

        if (doctor !== null) {
            const matchingSchedule = doctor.schedule.find(s => s._id?.toString() === scheduleId);
            const scheduleIndex: number = matchingSchedule ? doctor.schedule.indexOf(matchingSchedule) : 0;
            const matchingVisit = doctor.schedule[scheduleIndex].visits.find(v => v._id?.toString() === visitId);
            const visitIndex: number = matchingVisit ? doctor.schedule[scheduleIndex].visits.indexOf(matchingVisit) : 0;

            doctor.schedule[scheduleIndex].visits[visitIndex].isFree = isFree;
            doctor.schedule[scheduleIndex].visits[visitIndex].visitNote = visitNote;
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.name = name;
            doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.surname = surname;
            if (patientId !== '' && patientId !== null && patientId !== undefined) {
                doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.patientId = patientId;
            }

            if (doctor.schedule[scheduleIndex].visits[visitIndex].isFree === true) {
                doctor.schedule[scheduleIndex].visits[visitIndex].visitNote = '';
                doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.name = '';
                doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.surname = '';
                doctor.schedule[scheduleIndex].visits[visitIndex].patientInfo.patientId = '';
            }

            await doctor.save();
        }
        res.status(201).json(doctor);
    }
}

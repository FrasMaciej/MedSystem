import mongoose from "mongoose";

export interface VisitI {
    _id?: String;
    startHour: Date;
    finishHour: Date;
    isFree: boolean;
    patientInfo: {
        name: string;
        surname: string;
        patientId: string;
    },
    visitNote: string;
}

export interface ScheduleI {
    _id?: string;
    scheduleDate: Date;
    finishHour: Date;
    singleVisitTime: number;
    visits: VisitI[];
}

export interface DoctorI {
    _id: string;
    name: string;
    surname: string;
    city: string;
    specializations: string[];
    schedule: ScheduleI[];
    userId: string;
}

export interface VisitInfoI {
    doctorId: string;
    scheduleId?: string;
    visit: VisitI;
    docSpecialization?: string;
    docName: string;
    docSurname: string;
    docCity: string;
}

const ScheduleSchema = new mongoose.Schema<ScheduleI>({
    scheduleDate: Date,
    finishHour: Date,
    singleVisitTime: Number,
    visits: [{
        startHour: Date,
        finishHour: Date,

        isFree: {
            type: Boolean,
            default: true
        },
        patientInfo: {
            name: {
                type: String,
                defualt: ''
            },
            surname: {
                type: String,
                defualt: ''
            },
            patientId: {
                type: String,
                defualt: ''
            }
        },
        visitNote: {
            type: String,
            defualt: ''
        }
    }]
})

const DoctorSchema = new mongoose.Schema<DoctorI>({
    userId: String,
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    specializations: [String],
    schedule: [ScheduleSchema]
});

export const Doctor = mongoose.model('Doctor', DoctorSchema);


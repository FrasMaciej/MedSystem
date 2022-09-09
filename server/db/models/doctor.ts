import mongoose from "mongoose";
import { ScheduleI } from "../../shared/schedule";
import { DoctorI } from "../../shared/doctor";

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


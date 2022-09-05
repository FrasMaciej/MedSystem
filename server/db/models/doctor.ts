import mongoose from "mongoose";
const ScheduleSchema = new mongoose.Schema({
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

const DoctorSchema = new mongoose.Schema({
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

const Doctor = mongoose.model('Doctor', DoctorSchema);
export { };
module.exports = Doctor;


import { kStringMaxLength } from "buffer";

const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    scheduleDate:{
        type: Date,
    },
    //Godzina zakończenia pracy
    finishHour:{
        type: Date,
    },
    //Czas pojedynczej wizyty (ilość minut na jeden "slot")
    singleVisitTime:{
        type: Number,
    },
    //Tablica z poszczególnymi slotami
    visits:[{
        startHour:{
            type: Date,
        },
        finishHour:{
            type: Date,
        },
        isFree:{
            type: Boolean,
            default: true
        },
        patientInfo:{
            name:{
                type: String,
                defualt: ''
            },
            surname:{
                type: String,
                defualt: ''
            }
        },
        visitNote:{
            type: String,
            defualt: ''
        }
    }]
})

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true
    },
    specializations: {
        type: [String],
    },
    schedule:{
        type: [ScheduleSchema]
    } 
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export {};
module.exports = Doctor;
import { kStringMaxLength } from "buffer";

const mongoose = require('mongoose');

var VisitSchema = new mongoose.Schema({
    startHour:{
        type: Date,
        required: true
    },
    finishHour:{
        type: Date,
        required: true
    },
    isFree:{
        type: Boolean,
        required: true
    },
    patientInfo:{
        name:{
            type: String
        },
        surname:{
            type: String
        }
    },
    visitNote:{
        type: String
    }
});

var ScheduleSchema = new mongoose.Schema({
    //Zawiera rok, miesiąc i dzień dla grafiku oraz jednocześnie godzinę rozpoczęcia pracy
    scheduleDate:{
        type: Date,
        required: true,
    },
    //Godzina zakończenia pracy
    finishHour:{
        type: Date,
        required: true
    },
    //Czas pojedynczej wizyty (ilość minut na jeden "slot")
    singleVisitTime:{
        type: Number,
        required: true
    },
    //Tablica z poszczególnymi slotami
    visits:{
        type: [VisitSchema]
    }
});

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
    schedule: {
        type: [ScheduleSchema]
    }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export {};
module.exports = Doctor;
import mongoose from "mongoose";
const passportLocalMongoose = require('passport-local-mongoose');

const PatientSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    name: String,
    surname: String
});

PatientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('patients', PatientSchema, 'patients');


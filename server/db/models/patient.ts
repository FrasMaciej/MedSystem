import mongoose from "mongoose";
const passportLocalMongoose = require('passport-local-mongoose');

const PatientSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    surname: String
});

PatientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('patients', PatientSchema, 'patients');


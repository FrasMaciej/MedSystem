const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export {};
module.exports = Doctor;
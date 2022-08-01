const mongoose = require('mongoose');

const Doctor = mongoose.model('Doctor', {
    name: String,
    surname: String
});

export {};
module.exports = Doctor;
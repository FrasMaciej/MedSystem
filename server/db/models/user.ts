import mongoose from "mongoose";
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    name: String,
    surname: String,
    role: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('users', UserSchema, 'users');


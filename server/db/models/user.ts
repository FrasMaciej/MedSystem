import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    role: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('users', UserSchema, 'users');


import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { UserI } from "../../shared/user";

const UserSchema = new mongoose.Schema<UserI>({
    username: {
        type: String,
        minlength: 6
    },
    password: {
        type: String,
        minlength: 6
    },
    name: String,
    surname: String,
    role: String
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('users', UserSchema, 'users');
export default User;

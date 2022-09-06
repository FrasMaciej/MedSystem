import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface UserI {
    _id?: string;
    username: string,
    password?: string,
    name: string,
    surname: string,
    role: string
}

const UserSchema = new mongoose.Schema<UserI>({
    username: String,
    password: String,
    name: String,
    surname: String,
    role: String
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('users', UserSchema, 'users');
export default User;

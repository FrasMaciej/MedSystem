import mongoose from 'mongoose';
const { database } = require('../config');

export async function connectToDB() {
    try {
        await mongoose.connect(database, {});
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}




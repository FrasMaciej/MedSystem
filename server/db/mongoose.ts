import mongoose from 'mongoose';
import { config } from '../config';

export async function connectToDB() {
    try {
        await mongoose.connect(config.database, {});
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}




import { Schedule } from "./schedule";

export class Doctor {
    _id!: string;
    name!: string;
    surname!: string;
    city!: string;
    specializations!: string[];
    schedule!: Schedule[];
}
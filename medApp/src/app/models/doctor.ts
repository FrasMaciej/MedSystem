import { Schedule } from "./schedule";

export interface Doctor {
    name: string;
    surname: string;
    city: string;
    specializations: string[];
    schedule: Schedule[];
    _id?: string;
}

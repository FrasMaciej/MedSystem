import { Schedule } from "./schedule";

export interface Doctor {
    name: String;
    surname: String;
    city: String;
    specializations: String[];
    schedule: Schedule[];
    _id?: String;
}

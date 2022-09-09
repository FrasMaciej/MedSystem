import { ScheduleI } from "./schedule";

export interface DoctorI {
    _id: string;
    name: string;
    surname: string;
    city: string;
    specializations: string[];
    schedule: ScheduleI[];
    userId?: string;
}
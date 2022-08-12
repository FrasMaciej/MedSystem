import { Schedule } from "./schedule";

/* 
    podobnie
    Po co tutaj tworzyc klasy  
    do tego jest interface w ts
    wtedy mozna nawet zrobic plik .d.ts i nie sa potrzebne zadne importy
    typescript ogarnie wszystko
*/

export class Doctor {
    _id!: string;
    name!: string;
    surname!: string;
    city!: string;
    specializations!: string[];
    schedule!: Schedule[];
}
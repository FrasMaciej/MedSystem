export interface VisitI {
    _id?: string;
    startHour: Date;
    finishHour: Date;
    isFree: boolean;
    patientInfo: {
        patientId?: string;
        name: string;
        surname: string;
    },
    visitNote: string;
}

export interface ScheduleI {
    _id?: string;
    scheduleDate: Date;
    finishHour: Date;
    singleVisitTime: number;
    visits: VisitI[];
}

export interface VisitInfoI {
    doctorId: string;
    scheduleId: string;
    visit: VisitI;
    docName: string;
    docSurname: string;
    docCity: string;
    docSpecialization?: string;
}
export interface Patient {
    name: string;
    surname: string;
}

export interface Visit {
    _id: string;
    startHour: Date;
    finishHour: Date;
    isFree: boolean;
    patientInfo: Patient;
    visitNote: string;
}

export interface Schedule {
    _id: string;
    scheduleDate: Date;
    finishHour: Date;
    singleVisitTime: number;
    visits: Visit[];
}

export interface VisitInfo {
    doctorId: string;
    scheduleId: string;
    visit: Visit;
    docSpecialization: string;
    docName: string;
    docSurname: string;
    docCity: string;
}

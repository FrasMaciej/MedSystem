export interface Patient{
    name: String;
    surname: String;
}

export interface Visit{
    startHour: Date;
    finishHour: Date;
    isFree: Boolean;
    patientInfo: Patient;
    visitNote: String;
}

export interface Schedule {
    scheduleDate: Date;
    finishHour: Date;
    singleVisitTime: Number;
    _id: string;
    visits: Visit[];
}

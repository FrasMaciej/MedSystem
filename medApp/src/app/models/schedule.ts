export interface Patient{
    name: String;
    surname: String;
}

export interface Visit{
    _id: String;
    startHour: Date;
    finishHour: Date;
    isFree: Boolean;
    patientInfo: Patient;
    visitNote: String;
}

export interface Schedule {
    _id: string;
    scheduleDate: Date;
    finishHour: Date;
    singleVisitTime: Number;
    visits: Visit[];
}

export interface VisitInfo {
    doctorId: String,
    scheduleId: String,
    visit: Visit,
    docSpecialization: String,
    docName: String,
    docSurname: String,
    docCity: String
}

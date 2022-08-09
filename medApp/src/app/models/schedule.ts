class patient{
    name!: String;
    surname!: String;
}

class Visit{
    startHour!: Date;
    finishHour!: Date;
    isFree!: Boolean;
    patientInfo!: patient;
    visitNote!: String;
}

export class Schedule {
    scheduleDate!: Date;
    finishHour!: Date;
    singleVisitTime!: Date;
    visits!: Visit[];
}



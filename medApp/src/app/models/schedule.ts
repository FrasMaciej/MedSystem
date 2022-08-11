class patient{
    name!: String;
    surname!: String;
}

export class Visit{
    startHour!: Date;
    finishHour!: Date;
    isFree!: Boolean;
    patientInfo!: patient;
    visitNote!: String;
}

export class Schedule {
    scheduleDate: Date;
    finishHour: Date;
    singleVisitTime: Number;
    _id!: any;
    visits!: Visit[];

    constructor(scheduleDate: Date, finishHour: Date, singleVisitTime: Number){
        this.scheduleDate = new Date(scheduleDate);
        this.finishHour = new Date(finishHour);
        this.singleVisitTime = singleVisitTime;
    }

}



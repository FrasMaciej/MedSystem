export interface Visit {
    _id: String,
    startHour: Date,
    finishHour: Date,
    isFree: Boolean,
    patientInfo:{
        name: String,
        surname: String
    },
    visitNote: String
}

export interface Schedule {
    _id: String,
    scheduleDate: Date,
    finishHour: Date,
    singleVisitTime: Number,
    visits: Visit[]
}

export interface DoctorI {
    save()
    _id: String,
    name: String,
    surname: String,
    city: String,
    specializations: String[]
    schedule: Schedule[]
}
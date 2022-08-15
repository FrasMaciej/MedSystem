export interface Visit {
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
    scheduleDate: Date,
    finishHour: Date,
    singleVisitTime: Number,
    visits: Visit[]
}
export interface VisitI {
    startHour: Date,
    finishHour: Date,
    isFree: Boolean,
    patientInfo:{
        name: String,
        surname: String,
        patientId: String
    },
    visitNote: String
}

export interface ScheduleI {
    _id: String,
    scheduleDate: Date,
    finishHour: Date,
    singleVisitTime: Number,
    visits: VisitI[]
}

export interface DoctorI {
    _id: String,
    name: String,
    surname: String,
    city: String,
    specializations: String[],
    schedule: ScheduleI[]
}

export interface VisitInfoI {
    doctorId: String,
    scheduleId: String,
    visit: VisitI,
    docSpecialization?: String,
    docName: String,
    docSurname: String,
    docCity: String
}

export interface UserI {
    _id?: String,
    username: String,
    name: String,
    surname: String,
    role: String
}

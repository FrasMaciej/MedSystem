const express = require('express');
const router = express.Router();

const helloApi = require('../actions/api/helloApi');
const doctorActions = require('../actions/api/doctorsActions');
const patientsActions = require('../actions/api/patientsActions');
const passport = require('passport');  // authentication
const PatientDetails = require('../db/models/patient');

//Test Api
router.get('/', helloApi.rootPath);

// Pobieranie wszystkich lekarzy
router.get('/doctors', doctorActions.getAllDoctors);
// Wyciągnięcie wszystkich specjalizacji wśród lekarzy
router.get('/doctors/specs', doctorActions.getSpecs);
// Wyciągnięcie wszystkich lokalizacji lekarzy
router.get('/doctors/cities', doctorActions.getCities);
// Wyciągnięcie wizyt przy określonych kryteriach
router.post('/doctors/filteredVisits', doctorActions.getFilteredVisits);
// Pobieranie konkretnego lekarza
router.get('/doctors/:id', doctorActions.getDoctor);
// Zapisywanie nowego lekarza
router.post('/doctors', doctorActions.saveDoctor);
// Dodawanie nowej specjalizacji dla lekarza
router.post('/doctors/addSpecialization/:id', doctorActions.addSpecialization);
// Dodawanie slotów w grafiku
router.post('/doctors/addTerminsSlots/:id', doctorActions.addTerminsSlots);
// Edytowanie lekarza
router.put('/doctors/:id', doctorActions.updateDoctor);
// Usuwanie lekarza
router.delete('/doctors/:id', doctorActions.deleteDoctor);
// Edytowanie Danych wybranej wizyty
router.put('/doctors/editVisit/:doctorId/:scheduleId/:visitId', doctorActions.editVisit);

// Pacjenci
router.post('/patient/login', passport.authenticate('local', { failureRedirect: '/api' }), patientsActions.login)
router.post('/patient/register', patientsActions.register)


export {};
module.exports = router;
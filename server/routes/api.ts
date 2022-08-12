const express = require('express');
const router = express.Router();

const helloApi = require('../actions/api/helloApi');
const doctorActions = require('../actions/api/doctorsActions');

//Test Api
router.get('/', helloApi.rootPath);

// Pobieranie wszystkich lekarzy
router.get('/doctors', doctorActions.getAllDoctors);
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


export {};
module.exports = router;
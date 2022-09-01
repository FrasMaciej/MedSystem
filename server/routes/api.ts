const express = require('express');
const router = express.Router();

const helloApi = require('../actions/api/helloApi');
const doctorActions = require('../actions/api/doctorsActions');

//Test Api
router.get('/', helloApi.rootPath);
// Pobieranie wszystkich lekarzy
router.get('/doctors', doctorActions.getAllDoctors);
// Wyciągnięcie wszystkich specjalizacji wśród lekarzy
router.get('/doctors/specs', doctorActions.getSpecs);
// Wyciągnięcie wszystkich lokalizacji lekarzy
router.get('/doctors/cities', doctorActions.getCities);
// Wyciągnięcie wizyt przy określonych kryteriach (miasta, specjalizacje, terminy wizyt)
router.post('/doctors/filteredVisits', doctorActions.getFilteredVisits);
// Wyciągnięcie wizyt przypisanych dla wybranego pacjenta na podstawie jego Id
router.get('/doctors/findVisitByPatient/:id', doctorActions.getVisitsByPatientId);
// Pobieranie konkretnego lekarza
router.get('/doctors/:id', doctorActions.getDoctor);
// Pobieranie konkretnego lekarza na podstawie Id usera
router.get('/doctors/getByUserId/:id', doctorActions.getDoctorByUserId);
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
router.put('/doctors/editVisit/:doctorId/:scheduleId/:visitId/', doctorActions.editVisit);

export { };
module.exports = router;

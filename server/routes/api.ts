import express from 'express';
import { rootPath } from '../actions/api/helloApi';
import { DoctorActions } from '../actions/api/doctorsActions';

const router = express.Router();

//Test Api
router.get('/', rootPath);
// Pobieranie wszystkich lekarzy
router.get('/doctors', DoctorActions.getAllDoctors);
// Wyciągnięcie wszystkich specjalizacji wśród lekarzy
router.get('/doctors/specs', DoctorActions.getSpecs);
// Wyciągnięcie wszystkich lokalizacji lekarzy
router.get('/doctors/cities', DoctorActions.getCities);
// Wyciągnięcie wizyt przy określonych kryteriach (miasta, specjalizacje, terminy wizyt)
router.post('/doctors/filteredVisits', DoctorActions.getFilteredVisits);
// Wyciągnięcie wizyt przypisanych dla wybranego pacjenta na podstawie jego Id
router.get('/doctors/findVisitByPatient/:id', DoctorActions.getVisitsByPatientId);
// Pobieranie konkretnego lekarza
router.get('/doctors/:id', DoctorActions.getDoctor);
// Pobieranie konkretnego lekarza na podstawie Id usera
router.get('/doctors/getByUserId/:id', DoctorActions.getDoctorByUserId);
// Zapisywanie nowego lekarza
router.post('/doctors', DoctorActions.saveDoctor);
// Dodawanie nowej specjalizacji dla lekarza
router.post('/doctors/addSpecialization/:id', DoctorActions.addSpecialization);
// Dodawanie slotów w grafiku
router.post('/doctors/addTerminsSlots/:id', DoctorActions.addTerminsSlots);
// Edytowanie lekarza
router.put('/doctors/:id', DoctorActions.updateDoctor);
// Usuwanie lekarza
router.delete('/doctors/:id', DoctorActions.deleteDoctor);
// Edytowanie Danych wybranej wizyty
router.put('/doctors/editVisit/:doctorId/:scheduleId/:visitId/', DoctorActions.editVisit);

module.exports = router;

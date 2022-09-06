import express from 'express';
import { rootPath } from '../actions/api/helloApi';
import { DoctorActions } from '../actions/api/doctorsActions';

const apiRouter = express.Router();

//Test Api
apiRouter.get('/', rootPath);
// Pobieranie wszystkich lekarzy
apiRouter.get('/doctors', DoctorActions.getAllDoctors);
// Wyciągnięcie wszystkich specjalizacji wśród lekarzy
apiRouter.get('/doctors/specs', DoctorActions.getSpecs);
// Wyciągnięcie wszystkich lokalizacji lekarzy
apiRouter.get('/doctors/cities', DoctorActions.getCities);
// Wyciągnięcie wizyt przy określonych kryteriach (miasta, specjalizacje, terminy wizyt)
apiRouter.post('/doctors/filteredVisits', DoctorActions.getFilteredVisits);
// Wyciągnięcie wizyt przypisanych dla wybranego pacjenta na podstawie jego Id
apiRouter.get('/doctors/findVisitByPatient/:id', DoctorActions.getVisitsByPatientId);
// Pobieranie konkretnego lekarza
apiRouter.get('/doctors/:id', DoctorActions.getDoctor);
// Pobieranie konkretnego lekarza na podstawie Id usera
apiRouter.get('/doctors/getByUserId/:id', DoctorActions.getDoctorByUserId);
// Zapisywanie nowego lekarza
apiRouter.post('/doctors', DoctorActions.saveDoctor);
// Dodawanie nowej specjalizacji dla lekarza
apiRouter.post('/doctors/addSpecialization/:id', DoctorActions.addSpecialization);
// Dodawanie slotów w grafiku
apiRouter.post('/doctors/addTerminsSlots/:id', DoctorActions.addTerminsSlots);
// Edytowanie lekarza
apiRouter.put('/doctors/:id', DoctorActions.updateDoctor);
// Usuwanie lekarza
apiRouter.delete('/doctors/:id', DoctorActions.deleteDoctor);
// Edytowanie Danych wybranej wizyty
apiRouter.put('/doctors/editVisit/:doctorId/:scheduleId/:visitId/', DoctorActions.editVisit);

export default apiRouter;

import express from 'express';
import { rootPath } from '../actions/api/helloApi';
import * as doctorsActions from '../actions/api/doctorsActions';

const apiRouter = express.Router();

//Test Api
apiRouter.get('/', rootPath);
// Pobieranie wszystkich lekarzy
apiRouter.get('/doctors', doctorsActions.getAllDoctors);
// Wyciągnięcie wszystkich specjalizacji wśród lekarzy
apiRouter.get('/doctors/specs', doctorsActions.getSpecs);
// Wyciągnięcie wszystkich lokalizacji lekarzy
apiRouter.get('/doctors/cities', doctorsActions.getCities);
// Wyciągnięcie wizyt przy określonych kryteriach (miasta, specjalizacje, terminy wizyt)
apiRouter.post('/doctors/filteredVisits', doctorsActions.getFilteredVisits);
// Wyciągnięcie wizyt przypisanych dla wybranego pacjenta na podstawie jego Id
apiRouter.get('/doctors/findVisitByPatient/:id', doctorsActions.getVisitsByPatientId);
// Pobieranie konkretnego lekarza
apiRouter.get('/doctors/:id', doctorsActions.getDoctor);
// Pobieranie konkretnego lekarza na podstawie Id usera
apiRouter.get('/doctors/getByUserId/:id', doctorsActions.getDoctorByUserId);
// Zapisywanie nowego lekarza
apiRouter.post('/doctors', doctorsActions.saveDoctor);
// Dodawanie nowej specjalizacji dla lekarza
apiRouter.post('/doctors/addSpecialization/:id', doctorsActions.addSpecialization);
// Dodawanie slotów w grafiku
apiRouter.post('/doctors/addTerminsSlots/:id', doctorsActions.addTerminsSlots);
// Edytowanie lekarza
apiRouter.put('/doctors/:id', doctorsActions.updateDoctor);
// Usuwanie lekarza
apiRouter.delete('/doctors/:id', doctorsActions.deleteDoctor);
// Edytowanie Danych wybranej wizyty
apiRouter.put('/doctors/editVisit/:doctorId/:scheduleId/:visitId/', doctorsActions.editVisit);

export default apiRouter;

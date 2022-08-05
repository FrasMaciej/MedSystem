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
// Edytowanie lekarza
router.put('/doctors/:id', doctorActions.updateDoctor);
// Usuwanie lekarza
router.delete('/doctors/:id', doctorActions.deleteDoctor);

export {};
module.exports = router;
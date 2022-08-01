const Doctor = require('../../db/models/doctor');

class DoctorActions {

    saveDoctor(req: any, res: any){
        const name = req.body.name;
        const surname = req.body.surname;
        res.send('Nowy lekarz został dodany. Imię: ' + name + " nazwisko: " + surname);
    }

    getAllDoctors(req: any, res: any){
        res.send('Lista wszystkich lekarzy');
    }

    getDoctor(req: any, res: any){
        res.send('Info o lekarzu');
    }

    updateDoctor(req: any, res: any){
        res.send('Informacje o lekarzu zaktualizowane');
    }

    deleteDoctor(req: any, res: any){
        const id = req.params.id;
        res.send('Lekarz usunięty. ID: ' + id);
    }
}

module.exports = new DoctorActions()
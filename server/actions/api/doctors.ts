const Doctor = require('../../db/models/doctor');

module.exports = {
    saveDoctor(req: any, res: any){
        
        const newDoctor = new Doctor({
            name: 'Maciej',
            surname: "Fras"
        });
        newDoctor.save().then(() => {
            console.log('Nowy lekarz został dodany')
        });

    }
}
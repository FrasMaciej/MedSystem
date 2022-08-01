const mongoose = require('mongoose');
const {database} = require('../config');

//db connect - połączenie stałe, dostępne
mongoose.connect(database, {
    //useNewUrlParser: true, useUnifiedTopology: true
});


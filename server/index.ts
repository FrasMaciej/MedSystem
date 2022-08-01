const express = require('express');
const app = express();
const cors = require("cors");
const {port} = require('./config');
const apiRouter = require('./routes/api')

app.use(cors());
app.use(express.json());

//db
require('./db/mongoose')

//routes
app.use('/', apiRouter);

app.listen(port, function() {
    console.log("Backend Application listening at http://localhost:" + port)
});


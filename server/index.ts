const express = require('express');
const app = express();
const cors = require("cors");
const {port} = require('./config');

app.use(cors());
app.use(express.json());

//routes
const apiRouter = require('./routes/api')

app.use('/', apiRouter);

app.listen(port, function() {
    console.log("Backend Application listening at http://localhost:" + port)
});


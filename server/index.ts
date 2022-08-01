const express = require('express');
const app = express();
const cors = require("cors");
const {port} = require('./config');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());

// db
require('./db/mongoose');

// parsers
// Content-type: application/json
app.use(bodyParser.json());

// routes
app.use('/api', apiRouter);

// server
app.listen(port, function() {
    console.log("Backend Application listening at http://localhost:" + port)
});


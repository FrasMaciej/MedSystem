const express = require('express');
const app = express();
app.get('/', function(req: any, res: any) {
    res.send('Hello my Api! :)');
})
var server = app.listen(8080, function() {
    console.log("Backend Application listening at http://localhost:8080")
})


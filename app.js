'use strict';
const express = require('express'),
    bodyParser = require('body-parser'),
    apiRoutes = require('./routes/api_routes'),
    app = express(),
    port = 8080;

app.use((request, response, next) => {
    //console.log(request.headers);
    next()
});

app.use(bodyParser.json());

app.use('/', express.static('public'));
app.use('/api', apiRoutes);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!')
});

var server = app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});

server.timeout = 15 * 60 * 1000;

'use strict';
const express = require('express'),
    bodyParser = require('body-parser'),
    apiRoutes = require('./routes/api_routes'),
    app = express(),
    port = 8080;

app.use((request, response, next) => {
    // console.log(request.headers);
    next()
});

app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use('/', express.static('public'));
app.use('/api', apiRoutes);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!')
});

app.use('*', function (req, res) {
    res.redirect('/')
});

let server = app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});

server.timeout = 15 * 60 * 1000;

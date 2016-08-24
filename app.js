'use strict';

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    data = require('./libs/data'),
    utils = require('./libs/utils'),
    apiRouter = express.Router(),
    _ = require('lodash'),
    app = express(),
    config = require('getconfig');

app.set('rootPath', __dirname);
// Global Paths
app.set('paths', {
    routes: path.join(app.get('rootPath'), 'routes'),
    middleware: path.join(app.get('rootPath'), 'middleware')
});

app.use(bodyParser.json());

// Pull in all of the middleware
_.each(utils.getModulesInDirectory(app.get('paths').middleware, ['_', '.']), function (middleware) {
    require(middleware)(app, apiRouter);
});

// Pull in all of the routes
_.each(utils.getModulesInDirectory(app.get('paths').routes, ['_', '.']), function (route) {
    require(route)(app, apiRouter);
});

app.use('/api', apiRouter);

app.get('/users', function(request, response) {

    data.getUsers()
        .then(function(users) {
            response.send(users);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

app.post('/users', function(request, response) {

    const user = request.body;
    console.log(user);
    data.createUser(user)
        .then(function() {
            console.log(arguments);
            response.send(`${user.username} created`);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

// Needs to come after all of the other middleware so you don't expose your server code
app.use('/', express.static('public'));

app.listen(config.server.port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${config.server.port}`);
});

/* Error handler needs to be last so we don't end up with an orphaned process */
app.use((err, request, response) => {
    console.log(err);
    response.status(500).send('Something broke!');
});

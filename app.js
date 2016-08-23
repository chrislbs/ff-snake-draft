'use strict';

var express = require('express'),
    path = require('path'),
    _ = require('lodash'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    utils = require('utils'),
    app = express(),
    apiRouter = express.Router(),
    port = 8080,
    server;

app.use((request, response, next) => {
    //console.log(request.headers);
    next();
});

app.set('rootPath', __dirname);

// Global Paths
app.set('paths', {
    middleware: path.join(app.get('rootPath'), 'middleware'),
    routes: path.join(app.get('rootPath'), 'routes'),
    views: path.join(app.get('rootPath'), 'views')
});

// Start listening to the port
server = app.listen(port);
console.log('listening to port: ', port);
server.timeout = 300000;

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

// Swig Templating Setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({cache: false});

// Setup static file server for images, html, css/fonts, and js
app.use('/public', express.static('public'));

/* Use getModulesInDirectory(path, [ignore_prefixes...], module_callback) to import all of the
 * middleware and routes.
 */
// Middleware
_.each(utils.getModulesInDirectory(app.get('paths').middleware, ['_', '.']), function (middleware) {
    require(middleware)(app, apiRouter);
});

// Routes
_.each(utils.getModulesInDirectory(app.get('paths').routes, ['_', '.']), function (route) {
    require(route)(app, apiRouter);
});

// Setup the api router with a url prefixed by a version #
app.use('/api/v1', apiRouter);

// Default route if no match was found for the url just returns the rendered base.html
app.all('/*', function (req, res) {
    res.render('base', {});
});

app.use((err, request, response) => {
    console.log('Error: ', err, err && err.stack);
    response.status(500).json({'error': err});
});

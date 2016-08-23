'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    data = require('./libs/data'),
    players = require('./libs/data/players'),
    swig = require('swig'),
    app = express(),
    port = 8080;

app.use((request, response, next) => {
    //console.log(request.headers);
    next();
});

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

app.get('/users', function(request, response) {

    data.getUsers()
        .then(function(users) {
            response.status(200).json(users);
        })
        .catch(function(err) {
            console.log('Error getting users: ', err);
            response.status(500).json({'error': err});
        });
});

app.post('/users', function(request, response) {

    const user = request.body;
    //console.log(user);
    data.createUser(user)
        .then(function() {
            response.status(200).json({'message': `${user.username} created`});
        })
        .catch(function(err) {
            console.log('Error creating user: ', err);
            response.status(500).json({'error': err});
        });
});

app.post('/players', function(request, response) {

    const player = request.body;
    //console.log(player);
    players.createPlayer(player)
        .then((playerId) => {
            player.id = playerId;
            response.status(200).json(player);
        })
        .catch((err) => response.status(500).json({'error': err}));
});

app.get('/players', function(request, response) {

    players.getAllPlayers()
        .then((players) => {
            response.status(200).json(players);
        })
        .catch((err) => response.status(500).json({'error': err}));
});

app.get('/players/:id', function(request, response) {
    players.findPlayer(request.params.id)
        .then((player) => {
            if (player === null) {
                response.status(404).json({'message': `Unable to locate player with id: ${request.params.id}`});
            }
            else {
                response.status(200).json(player);
            }
        })
        .catch((err) => response.status(500).json({'error': err}));
});

app.delete('/players/:id', function(request, response) {
    players.deletePlayer(request.params.id)
        .then(() => response.status(204).json({'message': `Successfully deleted player with id: ${request.params.id}`}))
        .catch((err) => response.status(500).json({'error': err}));
});

// Default route if no match was found for the url
app.all('/*', function (req, res) {
    res.render('base', {});
});

app.use((err, request, response) => {
    console.log(err);
    response.status(500).send('Something broke!');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});

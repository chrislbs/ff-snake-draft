const express = require('express');
const bodyParser = require('body-parser');
const data = require('./libs/data');
const app = express();
const port = 8080;

app.use((request, response, next) => {
    //console.log(request.headers);
    next()
});

app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Hello from Express!');
});

app.get('/users', function(request, response) {

    data.getUsers()
        .then(function(users) {
            response.send(users);
        })
        .catch(function(err) {
            console.log(err)
            response.status(500).send(err);
        });
});

app.post('/users', function(request, response) {

    const user = request.body;
    console.log(user);
    data.createUser(user)
        .then(function() {
            console.log(arguments)
            response.send(`${user.username} created`);
        })
        .catch(function(err) {
            console.log(err)
            response.status(500).send(err);
        });
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('Something broke!')
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});

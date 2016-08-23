'use strict';

var data = require('libs/data');

module.exports = function(app, apiRouter) {
    apiRouter.get('/users/?', function(request, response) {

        data.getUsers()
            .then(function(users) {
                response.status(200).json(users);
            })
            .catch(function(err) {
                console.log('Error getting users: ', err);
                response.status(500).json({'error': err});
            });
    });

    apiRouter.post('/users/?', function(request, response) {

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
};

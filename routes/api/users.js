'use strict';

var users = require('libs/data/users');

module.exports = function(app, apiRouter) {
    apiRouter.get('/users/?', function(request, response) {

        users.getAllUsers()
            .then(function(users) {
                response.status(200).json(users);
            })
            .catch((err) => response.status(500).json({'error': err}));
    });

    apiRouter.post('/users/?', function(request, response) {

        const user = request.body;
        //console.log(user);
        users.createUser(user)
            .then((userId) => {
                user.id = userId;
                response.status(200).json(user);
            })
            .catch((err) => response.status(500).json({'error': err}));
    });

    apiRouter.get('/users/:id/?', function(request, response) {
        users.findUser(request.params.id)
            .then((user) => {
                if (user === null) {
                    response.status(404).json({'message': `Unable to locate user with id: ${request.params.id}`});
                }
                else {
                    response.status(200).json(user);
                }
            })
            .catch((err) => response.status(500).json({'error': err}));
    });

    apiRouter.delete('/users/:id/?', function(request, response) {
        users.deleteUser(parseInt(request.params.id))
            .then(() => response.status(200).json({'id': parseInt(request.params.id), 'message': `Successfully deleted user with id: ${request.params.id}`}))
            .catch((err) => response.status(500).json({'error': err}));
    });
};

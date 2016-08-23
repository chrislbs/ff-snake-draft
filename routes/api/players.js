'use strict';

var players = require('libs/data/players');

module.exports = function(app, apiRouter) {
    apiRouter.post('/players', function(request, response) {

        const player = request.body;
        //console.log(player);
        players.createPlayer(player)
            .then((playerId) => {
                player.id = playerId;
                response.status(200).json(player);
            })
            .catch((err) => response.status(500).json({'error': err}));
    });

    apiRouter.get('/players', function(request, response) {

        players.getAllPlayers()
            .then((players) => {
                response.status(200).json(players);
            })
            .catch((err) => response.status(500).json({'error': err}));
    });

    apiRouter.get('/players/:id', function(request, response) {
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

    apiRouter.delete('/players/:id', function(request, response) {
        players.deletePlayer(request.params.id)
            .then(() => response.status(204).json({'message': `Successfully deleted player with id: ${request.params.id}`}))
            .catch((err) => response.status(500).json({'error': err}));
    });
};

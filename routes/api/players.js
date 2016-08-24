'use strict';

const players = require('../../libs/data/players');

module.exports = function(app, apiRouter) {
    /**
     * Create a new player
     */
    apiRouter.post('/players/', function(request, response) {

        const player = request.body;
        console.log(player);
        players.createPlayer(player)
            .then((playerId) => {
                player.id = playerId;
                response.send(player);
            })
            .catch((err) => response.status(500).send(err));
    });

    /**
     * Retrieve all players
     */
    apiRouter.get('/players/', function(request, response) {

        players.getAllPlayers()
            .then((players) => {
                response.send(players);
            })
            .catch((err) => response.status(500).send(err));
    });

    /**
     * Retrieve a specific players
     */
    apiRouter.get('/players/:id', function(request, response) {
        players.findPlayer(request.params.id)
            .then((player) => {
                if (player === null) {
                    response.status(404).send();
                }
                else {
                    response.send(player);
                }
            })
            .catch((err) => response.status(500).send(err));
    });

    /**
     * Delete a specific players
     */
    apiRouter.delete('/players/:id', function(request, response) {
        players.deletePlayer(request.params.id)
            .then(() => response.status(204).send())
            .catch((err) => response.status(500).send(err));
    });
};

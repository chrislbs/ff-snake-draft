'use strict';
const express = require('express'),
    router = express.Router(),
    leagues = require('../../libs/data/leagues'),
    rosterSettings = require('./league/roster_settings'),
    scoringSettings = require('./league/scoring_settings'),
    teams = require('./league/teams');

/**
 * Create a new league
 * { "name" : "leagueName" }
 */
router.post('/', function(request, response) {

    const league = request.body;
    leagues.createLeague(league.name)
        .then((leagueId) => {

            response.send({ id : leagueId, name : league.name });
        })
        .catch((err) => response.status(500).send(err));
});

/**
 * Retrieve all leagues
 */
router.get('/', function(request, response) {

    leagues.getAllLeagues()
        .then((leagues) => {
            response.send(leagues);
        })
        .catch((err) => response.status(500).send(err));
});


/**
 * Retrieve a specific league
 */
router.get('/:name', function(request, response) {
    leagues.findLeague(request.params.name)
        .then((league) => {
            if (league == null) {
                response.status(404).send();
            }
            else {
                response.send(league);
            }
        })
        .catch((err) => response.status(500).send(err))
});

/**
 * Delete a specific league
 */
router.delete('/:name', function(request, response) {
    leagues.deleteLeague(request.params.name)
        .then(() => response.status(204).send())
        .catch((err) => response.status(500).send(err))
});

function leagueIdMiddlware(req, res, next) {
    var leagueName = req.params.name;
    leagues.findLeague(leagueName)
        .then((league) => {
            console.log('middleware');
            req.leagueId = league.id;
            next();
        });
}

router.use('/:name', leagueIdMiddlware);
router.use('/:name/rosterSettings', rosterSettings);
router.use('/:name/scoringSettings', scoringSettings);
router.use('/:name/teams', teams);

module.exports = router;
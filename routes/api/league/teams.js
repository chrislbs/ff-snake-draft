'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    teams = require('../../../libs/data/teams');

/**
 * Create a team in the league
 */
router.post('/', function(request, response) {

    const leagueId = request.leagueId;
    const name = request.body['name'];

    teams.createTeam(leagueId, name)
        .then((teamId) => {
            response.send({ 'id':teamId, 'name' : name });
        })
        .catch((err) => response.status(500).send(err));
});

/**
 * Retrieve the league's teams
 */
router.get('/', function(request, response) {

    const leagueId = request.leagueId;

    teams.getAllTeams(leagueId)
        .then((rows) => {
            response.send(rows);
        })
        .catch((err) => response.status(500).send(err));
});

/**
 * Retrieve a specific team from the league
 */
router.get('/:id', function(request, response) {

    const leagueId = request.leagueId;
    const teamId = request.params.id;

    teams.findTeam(leagueId, teamId)
        .then((row) => { response.send(row); })
        .catch((err) => response.status(500).send(err));
});

/**
 * Delete a specific team from the league
 */
router.delete('/:id', function(request, response) {

    const leagueId = request.leagueId;
    const teamId = request.params.id;

    teams.deleteTeam(leagueId, teamId)
        .then(() => { response.status(204).send(); })
        .catch((err) => response.status(500).send(err));
});

module.exports = router;
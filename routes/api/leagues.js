'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    leagues = require('../../libs/data/leagues'),
    rosterSettings = require('./league/roster_settings'),
    scoringSettings = require('./league/scoring_settings'),
    vorSettings = require('./league/vor_settings'),
    draft = require('./draft'),
    projectionCalc = require('../../libs/proj-calc'),
    scoring = require('../../libs/data/scoring'),
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
            req.leagueId = league.id;
            next();
        });
}

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

router.use('/:name', leagueIdMiddlware);
router.use('/:name', nocache);
router.use('/:name/rosterSettings', rosterSettings);
router.use('/:name/scoringSettings', scoringSettings);
router.use('/:name/vorSettings', vorSettings);
router.use('/:name/teams', teams);
router.use('/:name/draft', draft);

function filterProjections(req, projections) {
    if(req.query.position != null) {
        projections = _.filter(projections, (proj) => proj.position == req.query.position);
    }
    if(req.query.maxVor != null) {
        projections = _.filter(projections, (proj) => proj.vor < req.query.maxVor);
    }
    return projections;
}

router.get('/:name/projections', (req, res) => {
    return projectionCalc.getLeagueProjections(req.leagueId)
        .then((playerProjections) => {
            playerProjections = playerProjections.sort((p1, p2) => p1.vor - p2.vor).reverse();
            for(let i = 0; i < playerProjections.length; i++) {
                playerProjections[i].overallRank = i + 1;
            }
            playerProjections = filterProjections(req, playerProjections);

            let contentType = null;
            let responseObject = playerProjections;
            if(req.get('Accept') === 'application/json') {
                contentType = 'application/json';
            }
            else {
                contentType = 'text/csv';
                let headers = ['player', 'position', 'team', 'projectedPoints', 'vor', 'overallRank'];

                let allRows = [headers.join(',')];
                let playerRows = _.map(playerProjections, (playerProj) => {
                    return [
                        playerProj.player,
                        playerProj.position,
                        playerProj.team,
                        playerProj.projectedPoints,
                        playerProj.vor,
                        playerProj.overallRank
                    ].join(',')
                });

                responseObject = allRows.concat(playerRows).join('\n')
            }
            res.setHeader('Content-Type', contentType);
            res.send(responseObject);
        })
        .error((err) => res.status(500).send(err));
});

router.get('/:name/replacementProjections', (req, res) => {
    return projectionCalc.getReplacementPlayerScoreByPosition(req.leagueId)
        .then((replacementScores) => { res.send(replacementScores) })
        .error((err) => res.status(500).send(err));
});

module.exports = router;
'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    scoring = require('../../../libs/data/scoring');

/**
 * Update the league's scoring settings
 */
router.put('/', function(request, response) {

    const settings = request.body;
    const leagueId = request.leagueId;

    scoring.setScoringSettings(settings, leagueId)
        .then((settings) => {
            response.send(settings);
        })
        .catch((err) => response.status(500).send(err));
});

/**
 * Retrieve the league's scoring settings
 */
router.get('/', function(request, response) {

    const leagueId = request.leagueId;
    scoring.getScoringSettings(leagueId)
        .then((settings) => {
            response.send(settings);
        })
        .catch((err) => response.status(500).send(err));
});

module.exports = router;
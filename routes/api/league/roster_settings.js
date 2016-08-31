'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    roster = require('../../../libs/data/roster');


/**
 * Update the league's roster settings
 */
router.put('/', function(request, response) {

    const positions = request.body;
    const leagueId = request.leagueId;
    roster.setRosterSettings(leagueId, positions)
        .then(() => {
            response.send(positions);
        })
        .catch((err) => response.status(500).send(err));
});

/**
 * Retrieve the league's roster settings
 */
router.get('/', function(request, response) {

    const leagueId = request.leagueId;
    roster.getRosterSettings(leagueId)
        .then((rows) => {
            var positions = _.map(rows, (row) => row.position );
            response.send(positions);
        })
        .catch((err) => response.status(500).send(err));
});

module.exports = router;
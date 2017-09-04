'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    roster = require('../../../libs/data/roster');

const positionOrder = {
    "QB" : 0,
    "WR" : 1,
    "RB" : 2,
    "TE" : 3,
    "FLEX" : 4,
    "K" : 5,
    "DST" : 6,
    "D" : 7,
    "LB" : 8,
    "DL" : 9,
    "DB" : 10,
    "BN" : 9
};

function orderPositions(positions) {
    positions.sort((lhs, rhs) => {
        return positionOrder[lhs] > positionOrder[rhs];
    });
    return positions;
}

function validPositions(positions) {
    console.log('valid positions', Object.keys(positionOrder));;
    return _.every(positions, (pos) => positionOrder[pos] != null);
}

/**
 * Update the league's roster settings
 */
router.put('/', function(request, response) {

    const positions = request.body;
    const leagueId = request.leagueId;

    if (validPositions(positions)) {
        roster.setRosterSettings(leagueId, positions)
            .then(() => {
                response.send(orderPositions(positions));
            })
            .catch((err) => response.status(500).send(err));
    }
    else {
        response.status(400).send({ err : "invalidPositions" })
    }

});

/**
 * Retrieve the league's roster settings
 */
router.get('/', function(request, response) {

    const leagueId = request.leagueId;
    roster.getRosterSettings(leagueId)
        .then((rows) => {
            var positions = _.map(rows, (row) => row.position );
            response.send(orderPositions(positions));
        })
        .catch((err) => response.status(500).send(err));
});

module.exports = router;
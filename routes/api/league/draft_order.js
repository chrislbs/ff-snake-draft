'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    draftOrder = require('../../../libs/data/draft_order');

/**
 * Update the league's draft order
 */
router.put('/', function(request, response) {

    const teamIds = request.body;
    const leagueId = request.leagueId;

    draftOrder.setDraftOrder(leagueId, teamIds)
        .then(() => {
            response.send(teamIds);
        })
        .catch((err) => response.status(500).send(err));
});

/**
 * Retrieve the league's draft order
 */
router.get('/', function(request, response) {

    const leagueId = request.leagueId;
    draftOrder.getDraftOrder(leagueId)
        .then((rows) => {
            var teamIds = _.map(rows, (row) => row['team_id']);
            response.send(teamIds);
        })
        .catch((err) => response.status(500).send(err));
});

module.exports = router;
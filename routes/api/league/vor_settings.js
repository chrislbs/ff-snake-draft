'use strict';
const express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    vorSettings = require('../../../libs/data/vor-base');

const vorPositions = [ "QB", "WR", "RB", "TE", "K", "DST", "DL", "DB", "LB" ];

const vorDefault = _.reduce(vorPositions, (vorDefault, pos) => {
    vorDefault[pos] = 0;
    return vorDefault;
}, {});

/**
 * Update the league's vor settings
 */
router.put('/', function(request, response) {

    const leagueId = request.leagueId;
    var requestedSettings = request.body;

    requestedSettings = _.reduce(vorDefault, (settings, value, pos) => {
        settings[pos] = requestedSettings[pos] || vorDefault[pos];
        return settings;
    }, {});

    vorSettings.setVorBaselines(leagueId, requestedSettings)
        .then(() => {
            response.send(requestedSettings);
        })
        .error((err) => response.status(500).send(err));
});

/**
 * Retrieve the league's vor settings
 */
router.get('/', function(request, response) {

    const leagueId = request.leagueId;
    vorSettings.getVorBaselines(leagueId)
        .then((rows) => {
            var baselines = _.reduce(rows, (settings, row) => {
                settings[row['position']] = row['baseline'];
                return settings;
            }, {});
            response.send(baselines);
        })
        .error((err) => response.status(500).send(err));
});

module.exports = router;
'use strict';
const express = require('express'),
    router = express.Router(),
    analysts = require('../../libs/ff-analytics/analysts'),
    scoring = require('../../libs/ff-analytics/scoring'),
    ffraw = require('../../libs/ff-analytics/raw');;

/**
 * Retrieve data
 */
router.get('/analysts', function(request, response) {
    response.send(analysts.data(2015, true));
});

router.get('/scoringRules', function(request, response) {
    response.send(scoring.data);
});

router.get('/request', function(request, response) {
    response.send(ffraw.request);
});

router.get('/fetch', function(request, response) {
    ffraw.fetchData((sc, data) => {
        console.log(sc);
        console.log(data);
        response.send(data);
    });
});

module.exports = router;
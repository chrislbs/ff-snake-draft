'use strict';

const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    playersApi = require('./api/players'),
    leaguesApi = require('./api/leagues'),
    projections = require('./api/projections'),
    ff = require('./api/ffraw');


// ensure no cache for any api
router.use(function (req, res, next) {
    res.set('Cache-Control', 'no-store;max-age=0');
    next()
});

router.use('/projections', projections);

router.use(bodyParser.json());

router.use('/players', playersApi);
router.use('/leagues', leaguesApi);
router.use('/data', ff);

module.exports = router;

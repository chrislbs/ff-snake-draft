'use strict';

const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    playersApi = require('./api/players'),
    leaguesApi = require('./api/leagues'),
    ff = require('./api/ffraw');


router.use(bodyParser.json());

router.use('/players', playersApi);
router.use('/leagues', leaguesApi);
router.use('/data', ff);

module.exports = router;

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const playersApi = require('./api/players');

const router = express.Router();

router.use(bodyParser.json());

router.use('/players', playersApi);

module.exports = router;

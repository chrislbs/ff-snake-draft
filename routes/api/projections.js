'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    rotoParser = require('../../libs/roto/roto-parser'),
    ffaParser = require('../../libs/ff-analytics/ffa-parser'),
    projSet = require('../../libs/data/projection_set'),
    projData = require('../../libs/data/projection_data'),
    router = express.Router();

/**
 * Create a projection set
 */
router.post('/', bodyParser.text(), function(req, res) {
    projSet.createLoad()
        .then((loadId) => res.status(200).send({"loadId": loadId}))
        .error((err) => res.send({err: err}));
});

/**
 * Fetch all projection sets
 */
router.get('/', function(req, res) {
    projSet.getAll()
        .then((projections) => {
            res.status(200).send(projections.sort((lhs, rhs) => lhs.id - rhs.id).reverse())
        })
        .error((err) => res.send({err: err}));
});

router.post('/:id/roto', bodyParser.text(), function(req, res) {
    rotoParser.parseRaw(req.body)
        .then((data) => {
            projData.importData(req.params.id, data);
            res.status(200).send(data);
        })
        .error((err) => res.send({err: err}));
});

router.post('/:id/ffa', bodyParser.text({limit: "50mb"}), function(req, res) {
    ffaParser.parseRaw(req.body)
        .then((data) => {
            projData.importData(req.params.id, data);
            res.status(200).send(data);
        })
        .error((err) => res.send({err: err}));
});

module.exports = router;

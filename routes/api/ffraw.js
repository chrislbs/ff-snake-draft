'use strict';
const express = require('express'),
    router = express.Router(),
    projections = require('../../libs/data/ff/projections'),
    dataLoads = require('../../libs/data/ff/data-load'),
    analyticsData = require('../../libs/ff-analytics/data');

router.get('/fetch', function (request, response) {
    analyticsData.fetch((data) => {
        response.send(data);
    });
});

router.get('/loads', function (request, response) {
    dataLoads.getAll()
        .then((dataLoads) => response.send(dataLoads))
        .error((err) => response.status(500).send(err));
});

router.get('/loads/latest', function (request, response) {
    dataLoads.getLatest()
        .then((dataLoad) => response.send(dataLoad))
        .error((err) => response.status(500).send(err));
});

router.get('/loads/latest/projections', function (request, response) {
    dataLoads.getLatest()
        .then((dataLoad) => dataLoad.id)
        .then((loadId) => projections.fetchProjections(loadId))
        .then((projections) => response.send(projections))
        .error((err) => response.status(500).send(err));
});

router.post('/importLatest', function (request, response) {

    // analyticsData.fetch((data) => {
    //     projections.importData(data)
    //         .then((success) => response.send({success : true}))
    //         .error((err) => response.send({success : false, err : err}));
    // });
    let csv = request.body;
    let playerProjections = [];
    let headers = csv[0].split(',');
    for (let i = 1; i < csv.length; i++) {
        let columnValues = csv[i].split(',');
        let playerProj = {};
        for (let j = 0; j < columnValues.length; j++) {
            playerProj[headers[j].trim()] = data[j].trim();
        }
        playerProjections.push(playerProj);
    }
    projections.importData(playerProjections)
        .then((success) => response.send({success: true}))
        .error((err) => response.send({success: false, err: err}));
});

module.exports = router;
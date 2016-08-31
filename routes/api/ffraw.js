'use strict';
const express = require('express'),
    router = express.Router(),
    projections = require('../../libs/data/ff/projections'),
    analyticsData = require('../../libs/ff-analytics/data');

router.get('/fetch', function(request, response) {
    analyticsData.fetch((data) => { response.send(data); });
});

router.post('/importLatest', function(request, response) {

    analyticsData.fetch((data) => {
        projections.importData(data)
            .then((success) => response.send({success : true}))
            .error((err) => response.send({success : false, err : err}));
    });
});

module.exports = router;
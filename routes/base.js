'use strict';

var os = require('os'),
    v8 = require('v8'),
    throttle = require('middleware/_throttle');

module.exports = function(app) {
    app.all('/', function (req, res) {
        res.render('base', {});
    });

    // This request needs to be throttled to 1 request every 10 seconds
    app.all('/ping/?', throttle({interval: 10000, holdTime: 5000}), function (req, res) {
        res.status(200).json({
            'uptime': new Date().getTime() - app.start_time,
            'cpu': os.cpus(),
            'memory': {
                'total': os.totalmem(),
                'free': os.freemem(),
            },
            'load_avg': os.loadavg(),
            'heap': v8.getHeapStatistics()
        });
    });
};

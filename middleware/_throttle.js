'use strict';

let crypto = require('crypto');

let requests = {};
let holds = {};
let timeouts = {};

module.exports = (opts) => {
    const options = Object.assign({
        interval: 3000,
        holdTime: 3000,
        whitelist: {
            '127.0.0.1': true,
            'localhost': true
        },
        errorCode: 403,
        errorHtml: '<html><title>403 Forbidden</title><body><h1>403 Forbidden</h1><p>Client denied by server configuration.</p></body></html>'
    }, opts || {});

    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress;

        // Skip whitelisted ips
        if (options.whitelist[ip]) {
            next();
            return;
        }

        const stamp = new Date().getTime();
        const key = crypto.Hash('md5').update(ip + '::' + req.url + '::' + req.headers['user-agent']).digest('hex'); 

        // Make sure this ip isn't being held for exceeding the throttle
        if (holds[key]) {
            if ((stamp - holds[key]) < options.holdTime) {
                res.status(options.errorCode).send(options.errorHtml);
                return;
            } else {
                delete holds[key];
            }
        }

        // If this is the first request from this ip to this address, clear timeouts and continue
        if (!requests[key]) {
            requests[key] = stamp;

            // Clear any timeouts for this key if they are there
            if (timeouts[key]) {
                clearTimeout(timeouts[key]);
                delete timeouts[key];
            }

            next();
            return;
        }

        // Make sure this request won't exceed the throttle interval
        if ((stamp - requests[key]) < options.interval) {
            // Put this ip on hold for this address
            holds[key] = stamp;
            res.status(options.errorCode).send(options.errorHtml);
            return;
        } else {
            requests[key] = stamp;

            // Clear any timeouts for this key if they are there
            if (timeouts[key]) {
                clearTimeout(timeouts[key]);
                delete timeouts[key];
            }
        }

        // Clear the key from the requests object after the interval time has passed (plus a tick)
        timeouts[key] = setTimeout(() => {
            if (requests[key]) {
                delete requests[key];
            }

            delete timeouts[key];
        }, options.interval + 17);

        // Go on to the next middleware
        next();
    };
};

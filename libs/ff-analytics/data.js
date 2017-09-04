'use strict';

const http = require('http'),
    analysts = require('./analysts'),
    positions = require('./positions'),
    scoring = require('./scoring'),
    vor = require('./vor'),
    csvParse = require('csv-parse');

// no idea what this is supposed to be; hardcoded
const ptsBracket = [
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "0",
        "points": "10"
    },
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "6",
        "points": "7"
    },
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "13",
        "points": "4"
    },
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "20",
        "points": "1"
    },
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "27",
        "points": "0"
    },
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "34",
        "points": "-1"
    },
    {
        "ptsBracketId": 0,
        "leagueId": 0,
        "threshold": "99",
        "points": "-4"
    }
];

// the request to send to http://apps.fantasyfootballanalytics.net:80/Projections/DownloadProjections
const request = {
    season : 2016,
    week : "0",
    positions : Object.keys(positions.map),
    calctype : "\"weighted\"",
    ShouldImpute : false,
    aavOption : "AVG",
    adpOption : "AVG",
    analysts : analysts.all,
    scoringRules : scoring.data,
    ptsBracket : ptsBracket,
    positionVorBaselines : vor.baselines
};

/**
 * Parse the data returned from the ff-analytics site and convert it to a list of objects
 * where the keys in the object represent the header row of a csv and the values are the the data
 * in each column csv
 *
 * @param jsonResponse The raw json response string from the REST api call
 * @param callback A callback that takes (err, output) where output is the array of parsed objects
 */
function parseCsvData(jsonResponse, callback) {
    var csvJson = JSON.parse(jsonResponse);
    var csvData = csvJson['CsvData'];

    console.log('Starting parsing');
    console.log(csvData);
    csvParse(csvData, { columns : true }, (err, output) => {
        console.log('Completed parsing');
        callback(err, output);
    });
}

/**
 * Retrieve the current raw projections from ff-analytics website.
 *
 * @param onSuccess A callback function that receives a list of objects where each object represents
 * an individual players projections
 */
function fetch(onSuccess) {

    var requestObj = JSON.stringify(request);
    console.log('Sending request', requestObj);

    // the request details
    var options = {
        host : 'apps.fantasyfootballanalytics.net',
        port: 80,
        path: '/Projections/DownloadProjections',
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length' : Buffer.byteLength(requestObj)
        }
    };

    // building the request
    var req = http.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            console.log('All data fetched');
            parseCsvData(output, (err, parsedData) => {
                if (err) {
                    console.log(err);
                }
                onSuccess(parsedData);
            });
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.write(requestObj);

    req.end();
}

exports.fetch = fetch;

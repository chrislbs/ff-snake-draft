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

function parseCsvData(jsonResponse, callback) {
    var csvJson = JSON.parse(jsonResponse);
    var csvData = csvJson['CsvData'];

    console.log('Starting parsing');
    console.log(csvData);
    console.log(csvData.length);
    csvParse(csvData, (err, output) => {
        console.log('Completed parsing');
        if(err) {
            console.log(err);
        }
        console.log(output);
        callback(err, output);
    });
}

function fetchData(onSuccess) {

    var requestObj = JSON.stringify(request);
    console.log('Sending request', requestObj);

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
            console.log(output);
            parseCsvData(output, (err, csv) => {
                if (err) {
                    console.log(err);
                }
                onSuccess(res.statusCode, csv);
            });
            //var obj = JSON.parse(output);
            //onSuccess(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.write(requestObj);

    req.end();
}

exports.request = request;
exports.fetchData = fetchData;

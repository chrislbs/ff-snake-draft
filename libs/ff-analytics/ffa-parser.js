'use strict';

const moment = require('moment'),
    _ = require('lodash'),
    csvParse = require('csv-parse'),
    Promise = require('bluebird'),
    asyncCsvParse = Promise.promisify(csvParse);

const fieldMap = {
    // "player": "firstName",
    "team": "team",
    "position": "position",
    "fg0019": "fg0019",
    "fg2029": "fg2029",
    "fg3039": "fg3039",
    "fg4049": "fg4049",
    "fg50": "fg50",
    "fgMiss": "fgMiss",
    "fumbles": "fumbles",
    "games": "games",
    "idpAst": "idpAst",
    "idpFumlForce": "idpFumlForce",
    "idpFumlRec": "idpFumlRec",
    "idpInt": "idpInt",
    "idpPD": "idpPD",
    "idpSack": "idpSack",
    "idpSolo": "idpSolo",
    "idpTFL": "idpTFL",
    "idpTd": "idpTd",
    "pass300": "pass300",
    "pass350": "pass350",
    "pass40": "pass40",
    "pass400": "pass400",
    "passAtt": "passAtt",
    "passComp": "passComp",
    "passCompPct": "passCompPct",
    "passInc": "passInc",
    "passInt": "passInt",
    "passTds": "passTds",
    "passYds": "passYds",
    "rec": "rec",
    "rec100": "rec100",
    "rec150": "rec150",
    "rec200": "rec200",
    "rec40": "rec40",
    "recTds": "recTds",
    "recYds": "recYds",
    "returnTds": "returnTds",
    "returnYds": "returnYds",
    "rush100": "rush100",
    "rush150": "rush150",
    "rush200": "rush200",
    "rush40": "rush40",
    "rushAtt": "rushAtt",
    "rushTds": "rushTds",
    "rushYds": "rushYds",
    "sacks": "sacks",
    "twoPts": "twoPts",
    "xp": "xp"
};

function mapPlayerProj(playerProj) {
    let playerName = playerProj['player'];

    let firstName = playerName.split(' ')[0];
    let lastName = playerName.split(' ').slice(1).join(' ');

    let projData = {};
    projData['firstName'] = firstName;
    projData['lastName'] = lastName;

    _.each(fieldMap, (val, key) => {

        if (playerProj[key] != "NA") {
            projData[val] = playerProj[key];
        }
    });

    return projData;
}

function parseRaw(rawPlayerData) {

    return asyncCsvParse(rawPlayerData, {columns: true})
        .then((playerProjections) => _.map(playerProjections, mapPlayerProj));
    // csvParse(rawPlayerData, { columns : true }, (err, output) => {
    //     console.log('Completed parsing');
    //
    //     // parse player name
    //     let firstName =
    //     callback(err, output);
    // });
    // try {
    //     let lines = rawPlayerData.split('\n');
    //     // first line is blank
    //     lines = lines.slice(1);
    //     // second line is headers
    //     let headers = lines[0].split('\t');
    //     let players = lines.slice(1);
    //
    //     // is defense or offense players
    //     let fieldMap = headers.includes('FF') ? defenseFieldMap : offenseFieldMap;
    //
    //     let playerProjections = _.map(players, (p) => {
    //         let projData = {};
    //         let fieldData = p.split('\t');
    //         _.each(headers, (h, i) => {
    //             let fieldKey = fieldMap[h];
    //             let fieldVal = fieldData[i].trim();
    //
    //             if (fieldKey != null && fieldVal != null) {
    //
    //                 if (fieldKey === 'position' && ['S', 'DB', 'CB'].includes(fieldVal)) {
    //                     fieldVal = 'DB';
    //                 }
    //                 if (fieldKey === 'position' && ['DT', 'DE', 'DL'].includes(fieldVal)) {
    //                     fieldVal = 'DL';
    //                 }
    //                 projData[fieldKey] = fieldVal;
    //             }
    //         });
    //
    //         return projData;
    //     });
    //     // remaining body is data
    //     callback(null, playerProjections);
    // }
    // catch (ex) {
    //     callback(ex, null);
    // }
}

// module.exports.parseRaw = Promise.promisify(parseRaw);
module.exports.parseRaw = parseRaw;

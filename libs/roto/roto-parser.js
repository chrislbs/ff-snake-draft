'use strict';

const moment = require('moment'),
    _ = require('lodash'),
    Promise = require('bluebird');

const defenseFieldMap = {
    "LastName" : "lastName",
    "FirstName" : "firstName",
    "Team" : "team",
    "Pos." : "position",
    "Tackles" : "idpSolo",
    "Sacks" : "idpSack",
    "INT" : "idpInt",
    "TD" : "idpTd",
    "FF" : "idpFumlForce",
    "FR" : "idpFumlRec",
};

const offenseFieldMap = {
    "Last Name" : "lastName",
    "First Name" : "firstName",
    "Team" : "team",
    "Pos" : "position",
    "Bye" : "bye",
    "Pass Comp" : "passComp",
    "Pass Att" : "passAtt",
    "Pass TD" : "passTds",
    "Pass YD" : "passYds",
    "INT" : "passInt",
    "Skd" : "sacks",
    // TODO: might need to add these 2 together
    "FumbL" : "fumbles",
    "Fumb" : "fumbles",
    "Pass300" : "pass300",
    "Pass350" : "pass350",
    "Pass400" : "pass400",
    "Rush Att" : "rushAtt",
    "Rush YD" : "rushYds",
    "Rush TD" : "rushTds",
    "Rec" : "rec",
    "Rec YD" : "recYds",
    "Rec TD" : "recTds",
    "Ret TD" : "returnTds",
    "100Rush" : "rush100",
    "150Rush" : "rush150",
    "200Rush" : "rush200",
    "100Rec" : "rec100",
    "150Rec" : "rec150",
    "200Rec" : "rec200",
    "XPM" : "xp",
    // TODO: fg0019 is ignored
    "0-29" : "fg2029",
    "30-39" : "fg3039",
    "40-49" : "fg4049",
    "50+" : "fg50"
};

function parseRaw(rawPlayerData, callback) {

    try {
        let lines = rawPlayerData.split('\n');
        // first line is blank
        lines = lines.slice(1);
        // second line is headers
        let headers = lines[0].split('\t');
        let players = lines.slice(1);

        // is defense or offense players
        let fieldMap = headers.includes('FF') ? defenseFieldMap : offenseFieldMap;

        let playerProjections = _.map(players, (p) => {
            let projData = {};
            let fieldData = p.split('\t');
            _.each(headers, (h, i) => {
                let fieldKey = fieldMap[h];
                let fieldVal = fieldData[i].trim();

                if (fieldKey != null && fieldVal != null) {

                    if (fieldKey === 'position' && ['S', 'DB', 'CB'].includes(fieldVal)) {
                        fieldVal = 'DB';
                    }
                    if (fieldKey === 'position' && ['DT', 'DE', 'DL'].includes(fieldVal)) {
                        fieldVal = 'DL';
                    }
                    projData[fieldKey] = fieldVal;
                }
            });

            return projData;
        });
        // remaining body is data
        callback(null, playerProjections);
    }
    catch (ex) {
        callback(ex, null);
    }
}

module.exports.parseRaw = Promise.promisify(parseRaw);

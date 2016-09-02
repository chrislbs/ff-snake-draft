'use strict';

const mysql = require('promise-mysql'),
    rawProjections = require('./data/ff/projections'),
    dataLoads = require('./data/ff/data-load'),
    scoring = require('./data/scoring'),
    moment = require('moment'),
    _ = require('lodash');

const statToMultiMap = {
    // general
    fumbles : 'fumblesLost',
    twoPts : 'twoPts',
    // kicking
    fg0019 : 'fg0019',
    fg2029 : 'fg2029',
    fg3039 : 'fg3039',
    fg4049 : 'fg4049',
    fg50 : 'fg50',
    fgAtt : 'fgAttempt',
    fgMiss : 'fgMiss',
    xp : 'fgExtraPoint',
    // IDP
    idpAst : 'idpTackleAssist',
    idpFumlForce : 'idpFumbleForced',
    idpFumlRec : 'idpFumbleRecovered',
    idpInt : 'idpInterception',
    idpPD : 'idpPassDefended',
    idpSack : 'idpSack',
    idpSolo : 'idpTackleSolo',
    idpTFL : 'idpTackleForLoss',
    idpTd : 'idpTouchdown',
    // passing
    pass300 : 'pass300',
    pass350 : 'pass350',
    pass400 : 'pass400',
    pass40 : 'pass40',
    passAtt : 'passAttempt',
    passComp : 'passCompletion',
    passCompPct : 'passCompletionPercent',
    passInc : 'passIncompletion',
    passInt : 'passIntercepted',
    passTds : 'passTouchdown',
    passYds : 'passYardsPerPoint',
    sacks : 'passSacks',
    // receiving
    rec : 'recPointsPer',
    rec100 : 'rec100',
    rec150 : 'rec150',
    rec200 : 'rec200',
    rec40 : 'rec40',
    recTds : 'recTouchdown',
    recYds : 'recYardsPerPoint',
    // rushing
    rush100 : 'rush100',
    rush150 : 'rush150',
    rush200 : 'rush200',
    rush40 : 'rush40',
    rushAtt : 'rushAttempt',
    rushTds : 'rushTouchdown',
    rushYds : 'rushYardsPerPoint',
    // returns
    returnTds : 'returnTouchdown',
    returnYds: 'returnYardsPerPoint'
};

function latestProjections() {
    return dataLoads.getLatest()
        .then((dataLoad) => rawProjections.fetchProjections(dataLoad.id))
}

function calcMultipliers(settings) {
    _.each(Object.keys(settings), (key) => {
        if (key.includes('YardsPerPoint')) {
            var val = settings[key];
            if (val != 0) {
                settings[key] = 1 / val;
            }
        }
    });
    return settings;
}

function projToMultiplier(scoringSettings) {
    var multipliers = calcMultipliers(scoringSettings);
    var projMultiMap = {};
    _.forEach(statToMultiMap, function(scoringKey, projKey) {
        projMultiMap[projKey] = multipliers[scoringKey];
    });
    return projMultiMap;
}

function calcProjectedPoints(playerProjection, projMultiMap) {
    return _.reduce(projMultiMap, (total, multiplier, projKey) => {
        var projectedStat = playerProjection[projKey];
        total += projectedStat * multiplier;
        return total;
    });
}

function calcPlayerProjections(leagueId) {
    return scoring.getScoringSettings(leagueId)
        .then((scoringSettings) => {
            var projMultiMap = projToMultiplier(scoringSettings);
            return latestProjections()
                .then((playerProjections) => {
                    return _.map(playerProjections, (playerProj) => {
                        var totalPoints = calcProjectedPoints(playerProj, projMultiMap);
                        return {
                            player : playerProj.player,
                            position : playerProj.position,
                            team : playerProj.team,
                            projectedPoints : totalPoints
                        }
                    });
                });
        });
}

module.exports.calcMultipliers = calcMultipliers;
module.exports.projToMultiplier = projToMultiplier;
module.exports.calcPlayerProjections = calcPlayerProjections;

'use strict';

const mysql = require('promise-mysql'),
    projData = require('./data/projection_data'),
    projSet = require('./data/projection_set'),
    scoring = require('./data/scoring'),
    vor = require('./data/vor-base'),
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

/**
 * Return a promise containing the raw projections from the latest data load
 */
function latestProjections() {
    return projSet.getLatest().then((dataLoad) => projData.fetchProjections(dataLoad.id));
}

/**
 * Given the scoring settings, calculate the multipliers to use for each statistic
 *
 * @param settings The scoring settings
 */
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

/**
 *
 * @param scoringSettings
 * @returns {{}} A map of the player projection keys to what that value should be multiplied by
 */
function projToMultiplier(scoringSettings) {
    var multipliers = calcMultipliers(scoringSettings);
    var projMultiMap = {};
    _.forEach(statToMultiMap, function(scoringKey, projKey) {
        projMultiMap[projKey] = multipliers[scoringKey];
    });
    return projMultiMap;
}

/**
 *
 * @param playerProjection
 * @param projMultiMap
 * @returns The projected points for the season for a player
 */
function calcProjectedPoints(playerProjection, projMultiMap) {
    return _.reduce(projMultiMap, (total, multiplier, projKey) => {
        let projectedStat = playerProjection[projKey];
        if (projectedStat != null) {
            total += projectedStat * multiplier;
        }
        return total;
    });
}

/**
 *
 * @param scoringSettings
 * @returns {Promise.<T>|*}
 */
function calcPlayerProjections(scoringSettings) {
    let projMultiMap = projToMultiplier(scoringSettings);
    return latestProjections()
        .then((playerProjections) => {
            return _.map(playerProjections, (playerProj) => {
                let totalPoints = calcProjectedPoints(playerProj, projMultiMap);
                return {
                    player: `${playerProj.firstName} ${playerProj.lastName}`,
                    position: playerProj.position,
                    team: playerProj.team,
                    projectedPoints: totalPoints
                }
            });
        });
}

function getPositionToPlayers(playerProjections) {
    return _.reduce(playerProjections, (map, playerProj) => {
        let pos = playerProj.position;
        if(map[pos] == null) {
            map[pos] = [];
        }

        if(pos == 'DL') {
            map['LB'].push(playerProj)
        }
        if(pos == 'LB') {
            map['DL'].push(playerProj)
        }
        map[pos].push(playerProj);
        return map;
    }, { 'LB': [], 'DL' : []});
}

function getPositionToOrderedProjections(positionToPlayers) {
    return _.reduce(positionToPlayers, (map, players, pos) => {

        var scores = _.map(players, (player) => player.projectedPoints);
        scores = scores.sort((a, b) => a - b).reverse();
        map[pos] = scores;
        return map;
    }, {});
}

function calcReplacementScoreByPosition(leagueId, playerProjections) {

    let positionToPlayers = getPositionToPlayers(playerProjections);
    let positionToOrderedScores = getPositionToOrderedProjections(positionToPlayers);

    return vor.getVorBaselines(leagueId)
        .then((rows) => {
            return _.reduce(rows, (replacementScores, row) => {
                let pos = row.position;
                let baseline = row.baseline;
                let orderedScores = positionToOrderedScores[pos];

                if (orderedScores != null) {
                    let offset = Math.max(baseline - 1, 0);
                    let scoresToUse = _.take(_.slice(orderedScores, offset), 3);

                    replacementScores[pos] = scoresToUse.reduce((a, b) => a + b) / 3;
                }
                return replacementScores;
            }, {});
        });
}

/**
 *
 * @param leagueId
 * @returns {Promise.<T>|*}
 */
function getLeagueProjections(leagueId) {
    return scoring.getScoringSettings(leagueId)
        .then((scoringSettings) => { return calcPlayerProjections(scoringSettings); })
        .then((playerProjections) => {
            return calcReplacementScoreByPosition(leagueId, playerProjections)
                .then((replacementScores) => {
                    _.each(playerProjections, (player) => {
                        var pos = player.position;
                        var points = player.projectedPoints;
                        var avgPlayerPoints = replacementScores[pos];

                        player.vor = points - avgPlayerPoints;
                    });

                    return playerProjections;
                });
        });
}

function getReplacementPlayerScoreByPosition(leagueId) {
    return scoring.getScoringSettings(leagueId)
        .then((scoringSettings) => { return calcPlayerProjections(scoringSettings); })
        .then((playerProjections) => {
            return calcReplacementScoreByPosition(leagueId, playerProjections);
        });
}

module.exports.calcMultipliers = calcMultipliers;
module.exports.projToMultiplier = projToMultiplier;
module.exports.getLeagueProjections = getLeagueProjections;
module.exports.getReplacementPlayerScoreByPosition = getReplacementPlayerScoreByPosition;

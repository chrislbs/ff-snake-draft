'use strict';
const _ = require('lodash'),
    positions = require('./positions');

function onePointPer(yds) {
    return 1 / yds;
}

const scoringPoints = {
    // begin passing
    passYds : onePointPer(25),
    passTds: 4,
    passInt: -2,
    // unused passing
    sacks: -1, // qb getting sacked
    passAtt: 1,
    passComp : 1,
    passInc : 1,
    pass40: 1,
    pass300: 1,
    pass350: 1,
    pass400: 1,
    // begin rushing
    rushYds: onePointPer(10),
    rushTds: 6,
    // unused rushing
    rushAtt: 1,
    rush40: 1,
    rush100: 1,
    rush150: 1,
    rush200: 1,
    // begin receiving
    rec: 1,
    recYds: onePointPer(15),
    recTds: 6,
    // unused receiving
    rec40: 1,
    rec100 : 1,
    rec150: 1,
    rec200: 1,
    // begin returning
    returnYds: onePointPer(25),
    returnTds: 6,
    // begin general offense
    twoPts: 2,
    fumbles: -2,
    // begin kicking
    xp: 1, // extra points
    fg0019: 3,
    fg2029: 3,
    fg3039: 3,
    fg4049: 4,
    fg50: 5,
    fgMiss: -2,
    // begin team defense
    dstFumlRec: 1,
    dstInt: 1,
    dstSafety: 1,
    dstSack: 1,
    dstTd: 1,
    dstBlk: 1,
    dstPtsAllow: 1,
    // begin idp defense
    idpSolo: 1,
    idpAst: 0.5,
    idpSack: 2,
    idpInt: 3,
    idpFumlForce: 2,
    idpFumlRec: 2,
    idpPD: 1,
    idpTd: 6,
    idpSafety: 2
};

const positionScoringMap = {
    QB: [
        "passYds",
        "passAtt",
        "passComp",
        "passInc",
        "passTds",
        "passInt",
        "pass40",
        "pass300",
        "pass350",
        "pass400",
        "rushYds",
        "sacks",
        "rushAtt",
        "rush40",
        "rushTds",
        "twoPts",
        "fumbles"
    ],
    RB: [
        "rushYds",
        "rushAtt",
        "rushTds",
        "rush40",
        "rush100",
        "rush150",
        "rush200",
        "rec",
        "recYds",
        "recTds",
        "rec40",
        "returnYds",
        "returnTds",
        "twoPts",
        "fumbles"
    ],
    WR: [
        "rushYds",
        "rushAtt",
        "rushTds",
        "rush40",
        "rec",
        "recYds",
        "recTds",
        "rec40",
        "rec100",
        "rec150",
        "rec200",
        "returnYds",
        "returnTds",
        "twoPts",
        "fumbles"
    ],
    TE: [
        "rushYds",
        "rushAtt",
        "rushTds",
        "rush40",
        "rec",
        "recYds",
        "recTds",
        "rec40",
        "rec100",
        "rec150",
        "rec200",
        "returnYds",
        "returnTds",
        "twoPts",
        "fumbles"
    ],
    K: [
        "xp",
        "fg0019",
        "fg2029",
        "fg3039",
        "fg4049",
        "fg50",
        "fgMiss"
    ],
    DST: [
        "dstFumlRec",
        "dstInt",
        "dstSafety",
        "dstSack",
        "dstTd",
        "dstBlk",
        "returnYds",
        "dstPtsAllow"
    ],
    DL: [
        "idpSolo",
        "idpAst",
        "idpSack",
        "idpInt",
        "idpFumlForce",
        "idpFumlRec",
        "idpPD",
        "idpTd",
        "idpSafety"
    ],
    LB: [
        "idpSolo",
        "idpAst",
        "idpSack",
        "idpInt",
        "idpFumlForce",
        "idpFumlRec",
        "idpPD",
        "idpTd",
        "idpSafety"
    ],
    DB: [
        "idpSolo",
        "idpAst",
        "idpSack",
        "idpInt",
        "idpFumlForce",
        "idpFumlRec",
        "idpPD",
        "idpTd",
        "idpSafety"
    ]
};

const ignoredPositions = [];

exports.data = _.flatMap(positions.map, (positionId, position) => {
    var relevantScoring = positionScoringMap[position];
    return relevantScoring.map((scoringKey) => {
        var isYards = scoringKey.includes('Yds');
        var multi = scoringPoints[scoringKey];
        if(!isYards) {
            multi = multi.toString();
        }
        return {
            positionId : positionId.toString(),
            positionCode : position,
            dataCol : scoringKey,
            multiplier : multi
        }
    });
});



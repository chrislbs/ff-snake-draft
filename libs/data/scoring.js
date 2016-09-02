'use strict';

const mysql = require('promise-mysql'),
    moment = require('moment'),
    Promise = require('bluebird'),
    db = require('./db'),
    _ = require('lodash');

function buildCol(name, type, modifiers = null) {
    if (modifiers == null) {
        modifiers = []
    }
    return {
        colName : name,
        colType : type,
        colMods: modifiers.join(' '),
        isInt : type.includes('INT'),
        isDec : type.includes('DECIMAL'),
        isStr : type.includes('VARCHAR')
    }
}

function buildDecimalCol(name) {
    return buildCol(name, 'DECIMAL(19, 4)', ['DEFAULT 0']);
}

const scoringColMap = {
    id : buildCol('id', 'INT', ['NOT NULL', 'AUTO_INCREMENT']),
    leagueId : buildCol('league_id', 'INT', ['NOT NULL']),
    // general
    fumblesLost: buildDecimalCol('fumbles_lost'),
    twoPts : buildDecimalCol('two_point_conversion'),
    // kicking
    fg0019 : buildDecimalCol('field_goal_0019'),
    fg2029 : buildDecimalCol('field_goal_2029'),
    fg3039 : buildDecimalCol('field_goal_3039'),
    fg4049 : buildDecimalCol('field_goal_4049'),
    fg50 : buildDecimalCol('field_goal_50'),
    fgAttempt : buildDecimalCol('field_goal_att'),
    fgMiss : buildDecimalCol('field_goal_miss'),
    fgExtraPoint : buildDecimalCol('kicking_extra_point'),
    // IDP
    idpTackleAssist: buildDecimalCol('idp_assist_tackle'),
    idpTackleSolo: buildDecimalCol('idp_solo_tackle'),
    idpFumbleForced : buildDecimalCol('idp_fumble_forced'),
    idpFumbleRecovered: buildDecimalCol('idp_fumble_recovered'),
    idpInterception: buildDecimalCol('idp_interception'),
    idpPassDefended: buildDecimalCol('idp_pass_defended'),
    idpSack: buildDecimalCol('idp_sack'),
    idpTackleForLoss : buildDecimalCol('idp_tackle_for_loss'),
    idpTouchdown : buildDecimalCol('idp_touchdown'),
    // passing
    pass300 : buildDecimalCol('passing_300_yards'),
    pass350 : buildDecimalCol('passing_350_yards'),
    pass400 : buildDecimalCol('passing_400_yards'),
    pass40 : buildDecimalCol('passing_40_plus_yards'),
    passAttempt : buildDecimalCol('passing_attempt'),
    passCompletion : buildDecimalCol('passing_completion'),
    passCompletionPercent : buildDecimalCol('passing_completion_percent'),
    passIncompletion : buildDecimalCol('passing_incompletion'),
    passIntercepted : buildDecimalCol('passing_interception'),
    passTouchdown : buildDecimalCol('passing_touchdowns'),
    passYardsPerPoint : buildDecimalCol('passing_yards_per_point'),
    passSacks : buildDecimalCol('passer_sacked'), // quarterback sacked
    // receiving
    recPointsPer : buildDecimalCol('receptions_points_per'),
    rec100 : buildDecimalCol('receiving_100_yards'),
    rec150 : buildDecimalCol('receiving_150_yards'),
    rec200 : buildDecimalCol('receiving_200_yards'),
    rec40 : buildDecimalCol('reception_40_plus_yards'),
    recTouchdown : buildDecimalCol('receiving_touchdown'),
    recYardsPerPoint : buildDecimalCol('receiving_yards_per_point'),
    // rushing
    rush100 : buildDecimalCol('rushing_100_yards'),
    rush150 : buildDecimalCol('rushing_150_yards'),
    rush200 : buildDecimalCol('rushing_200_yards'),
    rush40 : buildDecimalCol('rush_40_plus_yards'),
    rushAttempt : buildDecimalCol('rushing_attempt'),
    rushTouchdown: buildDecimalCol('rushing_touchdown'),
    rushYardsPerPoint : buildDecimalCol('rushing_yards_per_point'),
    // returns
    returnTouchdown : buildDecimalCol('return_touchdown'),
    returnYardsPerPoint: buildDecimalCol('return_yards_per_point')
};

const colToKeyMap = _.reduce(scoringColMap, (colToKeyMap, colInfo, key) => {
    colToKeyMap[colInfo.colName] = key;
    return colToKeyMap;
}, {});

function getColumns() {
    return _.map(_.values(scoringColMap), (col) => {
        return [col.colName, col.colType, col.colMods].join(' ');

    }).join(',');
}

function buildInsert(scoringSettings, leagueId) {

    var scoringKeys = _.without(Object.keys(scoringColMap), 'leagueId', 'id');
    var scoringValues = _.map(scoringKeys, (key) => scoringSettings[key] );
    var scoringCols = _.map(scoringKeys, (key) => scoringColMap[key].colName );

    return `INSERT INTO league_scoring (league_id, ${scoringCols.join(',')}) VALUES (${leagueId}, ${scoringValues.join(',')});`;
}

function calcScoringSettings(settings) {
    var scoringKeys = _.without(Object.keys(scoringColMap), 'leagueId', 'id');
    return _.reduce(scoringKeys, (result, key) => {
        result[key] = (settings[key] || 0);
        return result;
    }, {});
}


function createScoringTable(connection) {
    var stmt = `CREATE TABLE IF NOT EXISTS league_scoring (${getColumns()}, UNIQUE KEY (league_id), PRIMARY KEY (id));`;

    return connection.query(stmt).then( () => connection);
}

function clearScoringSettings(connection, leagueId) {
    return connection.query('DELETE from league_scoring where league_id = ?', [leagueId])
        .then(() => connection);
}

function fetchSettings(connection, leagueId) {
    return connection.query('SELECT * from league_scoring where league_id = ?', [leagueId])
        .then((rows) => rows[0]);
}

function setScoringSettings(settings, leagueId) {
    return Promise.using(db.getConnection(), createScoringTable)
        .then((connection) => {
            return clearScoringSettings(connection, leagueId);
        })
        .then((connection) => {
            var scoringSettings = calcScoringSettings(settings);
            var stmt = buildInsert(scoringSettings, leagueId);
            return connection.query(stmt).then((result) => {
                scoringSettings.id = result.insertId;
                return scoringSettings;
            });
        })
}

function getScoringSettings(leagueId) {
    return Promise.using(db.getConnection(), createScoringTable)
        .then((connection) => { return fetchSettings(connection, leagueId)} )
        .then((row) => {
            if (row == null) {
                return {}
            }
            else {
                return _.reduce(row, (settings, val, col) => {
                    var key = colToKeyMap[col];
                    settings[key] = val;
                    return settings;
                }, {})
            }

        });
}

module.exports.getScoringSettings = getScoringSettings;
module.exports.setScoringSettings = setScoringSettings;

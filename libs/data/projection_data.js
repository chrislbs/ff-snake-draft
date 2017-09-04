'use strict';

const Promise = require('bluebird'),
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
    return buildCol(name, 'DECIMAL(19, 4)');
}

function buildCharCol(name) {
    return buildCol(name, 'VARCHAR(75)');
}

function buildIntCol(name) {
    return buildCol(name, 'INT');
}

const projColMap = {
    id : buildCol('id', 'INT', ['NOT NULL', 'AUTO_INCREMENT']),
    loadId : buildCol('load_id', 'INT', ['NOT NULL']),
    playerId : buildIntCol('player_id'),

    // BEGIN GENERAL PLAYER INFO //
    firstName: buildCharCol('first_name'),
    lastName: buildCharCol('last_name'),
    position : buildCharCol('position'),
    team : buildCharCol('team'),
    bye : buildIntCol('bye_week'),
    games: buildDecimalCol('games_played'),

    // BEGIN KICKER STATS //
    fg : buildDecimalCol('field_goal'),
    fg0019 : buildDecimalCol('field_goal_0019'),
    fg2029 : buildDecimalCol('field_goal_2029'),
    fg3039 : buildDecimalCol('field_goal_3039'),
    fg4049 : buildDecimalCol('field_goal_4049'),
    fg50 : buildDecimalCol('field_goal_50'),
    fgAtt : buildDecimalCol('field_goal_att'),
    fgMiss : buildDecimalCol('field_goal_miss'),
    xp : buildDecimalCol('kicking_extra_point'),

    // BEGIN GENERAL OFFENSE STATS //
    fumbles: buildDecimalCol('fumbles'), // not sure
    twoPts : buildDecimalCol('two_point_conversions'),

    // BEGIN IDP STATS //
    idpAst: buildDecimalCol('idp_assist_tackle'),
    idpFumlForce: buildDecimalCol('idp_fumble_forced'),
    idpFumlRec: buildDecimalCol('idp_fumble_recovered'),
    idpInt: buildDecimalCol('idp_interception'),
    idpPD: buildDecimalCol('idp_pass_defended'),
    idpSack : buildDecimalCol('idp_sack'),
    idpSolo : buildDecimalCol('idp_solo_tackle'),
    idpTFL : buildDecimalCol('idp_tackle_for_loss'),
    idpTd : buildDecimalCol('idp_touchdown'),

    // BEGIN PASSING STATS //
    pass300 : buildDecimalCol('passing_300_yards'),
    pass350 : buildDecimalCol('passing_350_yards'),
    pass400 : buildDecimalCol('passing_400_yards'),
    pass40 : buildDecimalCol('passing_40_plus_yards'),
    passAtt : buildDecimalCol('passing_attempts'),
    passComp : buildDecimalCol('passing_completions'),
    passCompPct : buildDecimalCol('passing_completion_percent'),
    passInc : buildDecimalCol('passing_incompletions'),
    passInt : buildDecimalCol('passing_interceptions'),
    passTds : buildDecimalCol('passing_touchdowns'),
    passYds : buildDecimalCol('passing_yards'),
    sacks : buildDecimalCol('sacks'),

    // BEGIN RECEIVING STATS //
    rec : buildDecimalCol('receptions'),
    rec100 : buildDecimalCol('receiving_100_yards'),
    rec150 : buildDecimalCol('receiving_150_yards'),
    rec200 : buildDecimalCol('receiving_200_yards'),
    rec40 : buildDecimalCol('reception_40_plus_yards'),
    recTds : buildDecimalCol('receiving_touchdowns'),
    recYds : buildDecimalCol('receiving_yards'),

    // BEGIN RUSHING STATS //
    rush100 : buildDecimalCol('rushing_100_yards'),
    rush150 : buildDecimalCol('rushing_150_yards'),
    rush200 : buildDecimalCol('rushing_200_yards'),
    rush40 : buildDecimalCol('rush_40_plus_yards'),
    rushAtt : buildDecimalCol('rushing_attempts'),
    rushTds : buildDecimalCol('rushing_touchdowns'),
    rushYds : buildDecimalCol('rushing_yards'),

    birthdate : buildCharCol('birth_date'),
    draftYear : buildCharCol('draft_year'),
    status : buildCharCol('status'), // not sure

    // BEGIN 3rd PARTY IDs //
    // yahooId : buildCharCol('yahoo_id'),
    // fbgId : buildCharCol('fbg_id'), // not sure
    // cbsId : buildCharCol('cbs_id'),
    // foxId : buildCharCol('fox_id'),
    // fftId : buildCharCol('ff_today_id'),
    // mflId: buildCharCol('mfl_id')

    // BEGIN RETURNER STATS //
    returnTds : buildDecimalCol('return_touchdowns'),
    returnYds : buildDecimalCol('return_yards'),

    // BEGIN TEAM DEFENSE STATS //
    // dstBlk : buildDecimalCol('team_blocked_fg_punt'),
    // dstFumlRec : buildDecimalCol('team_fumble_recovery'),
    // dstInt : buildDecimalCol('team_interceptions'),
    // dstPtsAllow : buildDecimalCol('team_points_allowed'),
    // dstRetTd : buildDecimalCol('team_returned_td'),
    // dstSack : buildDecimalCol('team_sacks'),
    // dstSafety : buildDecimalCol('team_safety'),
    // dstTd : buildDecimalCol('team_defense_td'),
};

/**
 * A map of the db column name to the field name
 */
const colToKeyMap = _.reduce(projColMap, (colToKeyMap, colInfo, key) => {
    colToKeyMap[colInfo.colName] = key;
    return colToKeyMap;
}, {});

/**
 * An array of all of the columns
 */
function getColumns() {
    return _.map(_.values(projColMap), (col) => {
        return [col.colName, col.colType, col.colMods].join(' ');

    }).join(',');
}

/**
 * Create the projection data table
 */
function createProjectionsTable(connection) {
    let fkStmt = 'FOREIGN KEY fk_proj_set (load_id) REFERENCES projection_set (id)';
    let pkStmt = 'PRIMARY KEY (id)';
    let uqStmt = 'UNIQUE KEY uq_player (load_id, first_name, last_name, position, team)';
    let stmt = `CREATE TABLE IF NOT EXISTS projection_data (${getColumns()}, ${pkStmt}, ${fkStmt}, ${uqStmt});`;

    return connection.query(stmt).then( () => connection);
}

/**
 *
 * @param projectionData
 * @param loadId
 * @returns {Array}
 */
function buildInserts(projectionData, loadId) {
    return _.map(projectionData, (playerProj) => {

        let projKeys = Object.keys(playerProj);
        let validKeys = _.intersection(projKeys, Object.keys(projColMap));
        // let invalidKeys = _.difference(projKeys, Object.keys(projColMap));
        // console.log(invalidKeys);

        let projCols = _.map(validKeys, (col) => {
            return projColMap[col].colName;
        });
        let projValues = _.map(validKeys, (key) => {
            let colData = projColMap[key];
            let val = playerProj[key];
            if(colData.isDec) {
                val = parseFloat(val) || 0;
            }
            else if (colData.isInt) {
                val = parseInt(val) || 0;
            }
            else {
                val = val.replace('\'', '');
                val = `'${val}'`
            }
            return val;
        });
        let insertStmt = `INSERT INTO projection_data (load_id, ${projCols.join(',')}) `;
        insertStmt += `VALUES (${loadId}, ${projValues.join(',')}) `;

        let dupKeys = _.map(projCols, (col) => `${col} = values(${col})`).join(',');
        insertStmt += `ON DUPLICATE KEY UPDATE ${dupKeys};`;

        return insertStmt;
    });
}

function promiseInserts(connection, inserts) {
    return _.map(inserts, (stmt) => connection.query(stmt));
}

/**
 * Return all projection data for the specified load id
 */
function getProjectionsForLoad(connection, loadId) {
    return connection.query('SELECT * from projection_data where load_id = ?', [loadId]);
    // return connection.query('SELECT * from projection_data where load_id = ? LIMIT 10', [loadId]);
}

function loadProjections(loadId, projectionData) {
    // nested promises?; this can't possibly be right
    return Promise.using(db.getConnection(), createProjectionsTable)
        .then((conn) => {
            let inserts = buildInserts(projectionData, loadId);
            return Promise.all(promiseInserts(conn, inserts));
        });
}

/**
 * For a given load id, fetch all of the projection data
 *
 * @param loadId
 * @returns {Promise.<TResult>}
 */
function fetchProjections(loadId) {
    return Promise.using(db.getConnection(), createProjectionsTable)
        .then((conn) => {
            return getProjectionsForLoad(conn, loadId);
        })
        .then((rows) => {
            return _.map(rows, (row) => {
                return _.reduce(row, (projection, val, col) => {
                    let key = colToKeyMap[col];
                    projection[key] = val;
                    return projection;
                }, {});
            });
        })
}

module.exports.importData = loadProjections;
module.exports.fetchProjections = fetchProjections;

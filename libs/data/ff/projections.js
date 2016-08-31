'use strict';

const mysql = require('promise-mysql'),
    moment = require('moment'),
    Promise = require('bluebird'),
    db = require('./../db'),
    _ = require('lodash'),
    ff_load = require('./data-load');

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
    player : buildCharCol('player'),
    position : buildCharCol('position'),
    team : buildCharCol('team'),
    bye : buildIntCol('bye_week'),
    dstBlk : buildDecimalCol('team_blocked_fg_punt'),
    dstFumlRec : buildDecimalCol('team_fumble_recovery'),
    dstInt : buildDecimalCol('team_interceptions'),
    dstPtsAllow : buildDecimalCol('team_points_allowed'),
    dstRetTd : buildDecimalCol('team_returned_td'),
    dstSack : buildDecimalCol('team_sacks'),
    dstSafety : buildDecimalCol('team_safety'),
    dstTd : buildDecimalCol('team_defense_td'),
    fg : buildDecimalCol('field_goal'), // not sure
    fg0019 : buildDecimalCol('field_goal_0019'),
    fg2029 : buildDecimalCol('field_goal_2029'),
    fg3039 : buildDecimalCol('field_goal_3039'),
    fg4049 : buildDecimalCol('field_goal_4049'),
    fg50 : buildDecimalCol('field_goal_50'),
    fgAtt : buildDecimalCol('field_goal_att'),
    fgMiss : buildDecimalCol('field_goal_miss'),
    fumbles: buildDecimalCol('fumbles'), // not sure
    games: buildDecimalCol('games_played'),
    idpAst: buildDecimalCol('idp_assist_tackle'),
    idpFumlForce: buildDecimalCol('idp_fumble_forced'),
    idpFumlRec: buildDecimalCol('idp_fumble_recovered'),
    idpInt: buildDecimalCol('idp_interception'),
    idpPD: buildDecimalCol('idp_pass_defended'),
    idpSack : buildDecimalCol('idp_sack'),
    idpSolo : buildDecimalCol('idp_solo_tackle'),
    idpTFL : buildDecimalCol('idp_tackle_for_loss'),
    idpTd : buildDecimalCol('idp_touchdown'),
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
    rec : buildDecimalCol('receptions'),
    rec100 : buildDecimalCol('receiving_100_yards'),
    rec150 : buildDecimalCol('receiving_150_yards'),
    rec200 : buildDecimalCol('receiving_200_yards'),
    rec40 : buildDecimalCol('reception_40_plus_yards'),
    recTds : buildDecimalCol('receiving_touchdowns'),
    recYds : buildDecimalCol('receiving_yards'),
    returnTds : buildDecimalCol('return_touchdowns'),
    returnYds : buildDecimalCol('return_yards'),
    rush100 : buildDecimalCol('rushing_100_yards'),
    rush150 : buildDecimalCol('rushing_150_yards'),
    rush200 : buildDecimalCol('rushing_200_yards'),
    rush40 : buildDecimalCol('rush_40_plus_yards'),
    rushAtt : buildDecimalCol('rushing_attempts'),
    rushTds : buildDecimalCol('rushing_touchdowns'),
    rushYds : buildDecimalCol('rushing_yards'),
    sacks : buildDecimalCol('sacks'), // note sure
    twoPts : buildDecimalCol('two_point_conversions'),
    xp : buildDecimalCol('kicking_extra_point'),
    status : buildCharCol('status'), // not sure
    yahooId : buildCharCol('yahoo_id'),
    fbgId : buildCharCol('fbg_id'), // not sure
    cbsId : buildCharCol('cbs_id'),
    foxId : buildCharCol('fox_id'),
    fftId : buildCharCol('ff_today_id'),
    birthdate : buildCharCol('birth_date'),
    draftYear : buildCharCol('draft_year'),
    mflId: buildCharCol('mfl_id')
};

function getColumns() {
    return _.map(_.values(projColMap), (col) => {
        return [col.colName, col.colType, col.colMods].join(' ');

    }).join(',');
}

function createProjectionsTable(connection) {
    var stmt = `CREATE TABLE IF NOT EXISTS ff_projections (${getColumns()}, PRIMARY KEY (id));`;

    return connection.query(stmt).then( () => connection);
}

function buildInserts(ffProjections, loadId) {
    return _.map(ffProjections, (playerProj) => {
        var projCols = _.map(_.without(Object.keys(projColMap), 'loadId', 'id'), (col) => {
            return projColMap[col].colName;
        });
        var projValues = _.map(_.without(Object.keys(projColMap), 'loadId', 'id'), (key) => {
            var colData = projColMap[key];
            var val = playerProj[key];
            if(colData.isDec) {
                val = parseFloat(val) || 0;
            }
            else if (colData.isInt) {
                val = parseInt(val) || 0;
            }
            else {
                val = `'${val}'`
            }
            return val;
        });
        return `
        INSERT INTO ff_projections (load_id, ${projCols.join(',')}) VALUES (${loadId}, ${projValues.join(',')});
        `.trim();
    });
}

function promiseInserts(connection, inserts) {
    return _.map(inserts, (stmt) => connection.query(stmt));
}

function importData(ffProjections) {
    // nested promises?; this can't possibly be right
    return Promise.using(db.getConnection(), (conn) => {
        return createProjectionsTable(conn)
            .then((conn) => {
                return ff_load.createLoad(conn)
                    .then((loadId) => {
                        var inserts = buildInserts(ffProjections, loadId);
                        return Promise.all(promiseInserts(conn, inserts));
                    });
            });

    });
}

module.exports.importData = importData;

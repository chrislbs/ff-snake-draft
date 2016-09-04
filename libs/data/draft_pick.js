'use strict';
const mysql = require('promise-mysql'),
    Promise = require('bluebird'),
    db = require('./db'),
    _ = require('lodash');

/**
 * Create the table for persisting the league draft picks
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createDraftPickTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS draft_pick (
        id INT NOT NULL AUTO_INCREMENT,
        league_id INT NOT NULL,
        player_name VARCHAR(75) NOT NULL,
        team VARCHAR(10) NOT NULL,
        UNIQUE KEY (league_id, player_name, team),
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Pick a player
 *
 * @param leagueId The id of the league
 * @param playerName The name of the player
 * @param teamName The team name of the player
 * @returns {Promise}
 */
function pickPlayer(leagueId, playerName, teamName) {
    return Promise.using(db.getConnection(), createDraftPickTable)
        .then((connection) => {
            var data = {
                player_name : playerName,
                team : teamName,
                league_id : leagueId
            };
            return connection.query('INSERT INTO draft_pick SET ?', data);
        })
        .then((result) => result.insertId);
}

/**
 * Undo the last pick
 *
 * @param leagueId The id of the league
 * @returns {Promise}
 */
function undoLastPick(leagueId) {
    return Promise.using(db.getConnection(), createDraftPickTable)
        .then((connection) => {
            return connection.query('SELECT id FROM draft_pick ORDER BY id desc LIMIT 1')
                .then((rows) => rows.length == 0 ? null : rows[0]['id'])
                .then((pickId) => {
                    if(pickId) {
                        return connection.query('DELETE FROM draft_pick WHERE id= ?', pickId);
                    }
                    return null;
                });
        })
}

/**
 * Get all of the picks from the league
 * @param leagueId The id of the league
 * @returns {*|Promise.<T>}
 */
function getPicks(leagueId) {
    return Promise.using(db.getConnection(), createDraftPickTable)
        .then((connection) => {
            return connection.query('SELECT * FROM draft_pick ORDER BY id desc')
        })
}

module.exports.pickPlayer = pickPlayer;
module.exports.undoLastPick = undoLastPick;
module.exports.getPicks = getPicks;

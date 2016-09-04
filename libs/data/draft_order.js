'use strict';
const mysql = require('promise-mysql'),
    Promise = require('bluebird'),
    db = require('./db'),
    _ = require('lodash');

/**
 * Create the table for persisting the league roster settings
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createDraftOrderTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS draft_order (
        id INT NOT NULL AUTO_INCREMENT,
        league_id INT NOT NULL,
        team_id INT NOT NULL,
        sort_order INT NOT NULL,
        UNIQUE KEY (league_id, team_id),
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Set the draft order for the league
 *
 * @param leagueId The id of the league the roster settings belong to
 * @param orderedTeams The ordered teams for the draft
 * @returns {Promise} A promise that returns the id of the created leagues
 */
function setDraftOrder(leagueId, orderedTeams) {
    return Promise.using(db.getConnection(), createDraftOrderTable)
        .then((connection) => {
            return clearDraftOrder(connection, leagueId)
                .then(() => {
                    return Promise.all(insertTeams(connection, leagueId, orderedTeams));
                });
        });
}

/**
 * Clear the draft order for the league with the specified id
 *
 * @param connection The db connection to use
 * @param leagueId The id of the league to clear the draft order of
 * @returns {Promise} A promise that returns the result of the delete query
 */
function clearDraftOrder(connection, leagueId) {
    return connection.query('DELETE from draft_order where league_id = ?', [leagueId]);
}

function insertTeams(connection, leagueId, teamIds) {
    return _.map(teamIds, (teamId, index) => {
        var insert = `INSERT into draft_order (league_id, team_id, sort_order) VALUES (${leagueId}, ${teamId}, ${index});`;
        return connection.query(insert);
    });
}

/**
 * Retrieve the draft order for the particular league
 *
 * @returns {Promise} A promise that returns the draft order for the league
 */
function getDraftOrder(leagueId) {
    return Promise.using(db.getConnection(), createDraftOrderTable)
        .then((connection) => {
            return connection.query('SELECT * FROM draft_order where league_id = ? ORDER BY sort_order', [leagueId]);
        });
}

module.exports.getDraftOrder = getDraftOrder;
module.exports.setDraftOrder = setDraftOrder;

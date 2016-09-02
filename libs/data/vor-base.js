'use strict';
const mysql = require('promise-mysql'),
    Promise = require('bluebird'),
    db = require('./db'),
    _ = require('lodash');

/**
 * Create the table for persisting the leagues vor baseline settings
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createRosterTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS vor_baselines (
        id INT NOT NULL AUTO_INCREMENT,
        league_id INT NOT NULL,
        position VARCHAR(4) NOT NULL,
        baseline INT NOT NULL,
        UNIQUE KEY (league_id, position, baseline),
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Set the value over replacement baselines for the league
 *
 * Note: baselines should sum up to be approx 5/8 of the entire draft's picks; 138
 *
 * @param leagueId The id of the league the roster settings belong to
 * @param baselines A map of the position -> vor baseline picks
 * @returns {Promise} A promise that returns the id of the created leagues
 */
function setVorBaselines(leagueId, baselines) {
    return Promise.using(db.getConnection(), createRosterTable)
        .then((connection) => {
            return clearVorBaselines(connection, leagueId)
                .then(() => {
                    return Promise.all(insertBaselines(connection, leagueId, baselines));
                });
        });
}

/**
 * Clear the vor baselines for the league with the specified id
 *
 * @param connection The db connection to use
 * @param leagueId The id of the league to clear the baseline settings of
 * @returns {Promise} A promise that returns the result of the delete query
 */
function clearVorBaselines(connection, leagueId) {
    return connection.query('DELETE from vor_baselines where league_id = ?', [leagueId]);
}

function insertBaselines(connection, leagueId, baselines) {
    return _.map(baselines, (baseline, position) => {
        var insert = `INSERT into vor_baselines (league_id, position, baseline) VALUES (${leagueId}, '${position}', ${baseline});`;
        return connection.query(insert);
    });
}

/**
 * Retrieve the roster settings for the particular league
 *
 * @returns {Promise} A promise that returns the roster settings for the league
 */
function getVorBaselines(leagueId) {
    return Promise.using(db.getConnection(), createRosterTable)
        .then((connection) => {
            return connection.query('SELECT * FROM vor_baselines where league_id = ?', [leagueId]);
        });
}

module.exports.getVorBaselines = getVorBaselines;
module.exports.setVorBaselines = setVorBaselines;

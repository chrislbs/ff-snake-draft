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
function createRosterTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS roster_settings (
        id INT NOT NULL AUTO_INCREMENT,
        league_id INT NOT NULL,
        position VARCHAR(4) NOT NULL,
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Set the roster settings for the league
 *
 * @param leagueId The id of the league the roster settings belong to
 * @param positions The positions required for the league
 * @returns {Promise} A promise that returns the id of the created leagues
 */
function setRosterSettings(leagueId, positions) {
    return Promise.using(db.getConnection(), createRosterTable)
        .then((connection) => {
            return clearRosterSettings(connection, leagueId)
                .then(() => {
                    return Promise.all(insertPositions(connection, leagueId, positions));
                });
        });
}

/**
 * Clear the roster settings for the league with the specified id
 *
 * @param connection The db connection to use
 * @param leagueId The id of the league to clear the roster settings of
 * @returns {Promise} A promise that returns the result of the delete query
 */
function clearRosterSettings(connection, leagueId) {
    return connection.query('DELETE from roster_settings where league_id = ?', [leagueId]);
}

function insertPositions(connection, leagueId, positions) {
    return _.map(positions, (pos) => {
        var insert = `INSERT into roster_settings (league_id, position) VALUES (${leagueId}, '${pos}');`;
        console.log(insert);
        return connection.query(insert);
    });
}

/**
 * Retrieve the roster settings for the particular league
 *
 * @returns {Promise} A promise that returns the roster settings for the league
 */
function getRosterSettings(leagueId) {
    return Promise.using(db.getConnection(), createRosterTable)
        .then((connection) => {
            return connection.query('SELECT * FROM roster_settings where league_id = ?', [leagueId]);
        });
}

module.exports.getRosterSettings = getRosterSettings;
module.exports.setRosterSettings = setRosterSettings;

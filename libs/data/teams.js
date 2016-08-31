'use strict';
const mysql = require('promise-mysql'),
    Promise = require('bluebird'),
    db = require('./db'),
    _ = require('lodash');

/**
 * Create the table for persisting the league teams
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createTeamTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS teams (
        id INT NOT NULL AUTO_INCREMENT,
        league_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Create a team for the specified league
 *
 * @param leagueId The id of the league to associate this team with
 * @param teamName The name of the team
 * @returns {Promise} A promise that returns the id of the team
 */
function createTeam(leagueId, teamName) {
    var data = { 'league_id' : leagueId, 'name' : teamName };
    return Promise.using(db.getConnection(), createTeamTable)
        .then((connection) => {
            return connection.query('INSERT INTO teams SET ?', data);
        })
        .then((result) => result.insertId);
}

/**
 * Retrieve all teams for the specified league
 *
 * @returns {Promise} A promise that returns the teams for the specified league
 */
function getAllTeams(leagueId) {
    return Promise.using(db.getConnection(), createTeamTable)
        .then((connection) => {
            return connection.query('SELECT * FROM teams where league_id = ?', [leagueId]);;
        });
}

/**
 * Retrieve the team with the specified league and team id
 *
 * @param leagueId The id of the league the team belongs to
 * @param teamId The id of the team
 * @returns {Promise} A promise that returns the team or null if one wasn't found
 */
function findTeam(leagueId, teamId) {
    return Promise.using(db.getConnection(), createTeamTable)
        .then((conn) => {
            var stmt = mysql.format('SELECT * FROM teams WHERE id = ? and league_id = ?', [teamId, leagueId]);
            return conn.query(stmt);
        })
        .then((rows) => {
            return rows[0];
        });
}

/**
 * Delete the specified team
 *
 * @param leagueId The id of the league the team belongs to
 * @param teamId The id of the team to be deleted
 * @returns {Promise} A promise that returns the result of the delete query
 */
function deleteTeam(leagueId, teamId) {
    return Promise.using(db.getConnection(), createTeamTable)
        .then((conn) => {
            var del = mysql.format('DELETE FROM teams where id = ? and league_id = ?', [teamId, leagueId]);
            return conn.query(del);
        });
}

module.exports.createTeam = createTeam;
module.exports.getAllTeams = getAllTeams;
module.exports.findTeam = findTeam;
module.exports.deleteTeam = deleteTeam;

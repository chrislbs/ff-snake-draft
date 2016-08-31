'use strict';
const mysql = require('promise-mysql'),
    moment = require('moment'),
    Promise = require('bluebird'),
    db = require('./db');

/**
 * Create the table for persisting a league if it doesn't exist using the provided connection.
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createLeagueTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS leagues (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        UNIQUE KEY (name),
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Create a league with the specified name
 *
 * @parame name The name of the leagues
 * @returns {Promise} A promise that returns the id of the created leagues
 */
function createLeague(name) {
    var data = { name : name };
    return Promise.using(db.getConnection(), createLeagueTable)
        .then((connection) => {
            return connection.query('INSERT INTO leagues SET ?', data);
        })
        .then((result) => result.insertId);
}

/**
 * Retrieve all rows from the leagues table
 *
 * @returns {Promise} A promise that returns all of the rows in the table
 */
function getAllLeagues() {
    return Promise.using(db.getConnection(), createLeagueTable)
        .then((connection) => {
            return connection.query('SELECT * FROM leagues');
        });
}

/**
 * Retrieve the league from the table with the specified name
 *
 * @param name The name of the league to retrieve
 * @returns {Promise} A promise that returns the player or null if one wasn't found
 */
function findLeague(name) {
    return Promise.using(db.getConnection(), createLeagueTable)
        .then((conn) => {
            var stmt = mysql.format('SELECT * FROM leagues WHERE name = ?', [name]);
            console.log(stmt);
            return conn.query(stmt);
        })
        .then((rows) => {
            return rows[0];
        });
}

/**
 * Delete the league from the table with the specified name
 *
 * @param name The name of the league to delete
 * @returns {Promise} A promise that returns the result of the delete query
 */
function deleteLeague(name) {
    return Promise.using(db.getConnection(), createLeagueTable)
        .then((conn) => {
            var del = mysql.format('DELETE FROM leagues where name = ?', [name]);
            return conn.query(del);
        });
}

module.exports.createLeague = createLeague;
module.exports.getAllLeagues = getAllLeagues;
module.exports.findLeague = findLeague;
module.exports.deleteLeague = deleteLeague;

'use strict';
const mysql = require('promise-mysql'),
    moment = require('moment'),
    Promise = require('bluebird'),
    db = require('./db');

/**
 * Create the table for storing players if it doesn't exist using the provied connection.
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createPlayerTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS players (
        id INT NOT NULL AUTO_INCREMENT,
        uq_id VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        birthday DATE,
        UNIQUE KEY (uq_id),
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Create a player in the table. The player object should be in the form:
 * {
 *   name: '<first> <last>',
 *   birthday: 'yyyyMMdd'
 * }
 *
 * @param player The player to persist into the players table
 * @returns {Promise} A promise that returns the id of the row for the player
 */
function createPlayer(player) {
    var data = {
        name : player.name,
        birthday : moment(player.birthday).format('YYYY-MM-DD')
    };
    console.log(data);
    return Promise.using(db.getConnection(), createPlayerTable)
        .then((connection) => {
            return connection.query('INSERT INTO players SET ?', data);
        })
        .then((result) => result.insertId);
}

/**
 * Retrieve all rows from the player table
 *
 * @returns {Promise} A promise that returns all of the rows in the table
 */
function getAllPlayers() {
    return Promise.using(db.getConnection(), createPlayerTable)
        .then((connection) => {
            return connection.query('SELECT * FROM players');
        });
}

/**
 * Retrieve the player from the table with the specified id
 *
 * @param playerId The id of the player to retrieve
 * @returns {Promise} A promise that returns the player or null if one wasn't found
 */
function findPlayer(playerId) {
    return Promise.using(db.getConnection(), createPlayerTable)
        .then((conn) => {
            var stmt = mysql.format('SELECT * FROM players WHERE id = ?', [playerId]);
            return conn.query(stmt);
        })
        .then((rows) => {
            return rows[0];
        });
}

/**
 * Delete the player from the table with the specified id
 *
 * @param playerId The id of the player to delete
 * @returns {Promise} A promise that returns the result of the delete query
 */
function deletePlayer(playerId) {
    return Promise.using(db.getConnection(), createPlayerTable)
        .then((conn) => {
            var del = mysql.format('DELETE FROM players where id = ?', [playerId]);
            return conn.query(del);
        });
}

module.exports.createPlayer = createPlayer;
module.exports.getAllPlayers = getAllPlayers;
module.exports.findPlayer = findPlayer;
module.exports.deletePlayer = deletePlayer;

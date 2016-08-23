'use strict';

const mysql = require('promise-mysql');
const Promise = require('bluebird');
const db = require('./db');

/**
 * Create the table for storing users if it doesn't exist using the provied connection.
 *
 * @param connection The db connection to execute the create table statement against
 * @returns {Promise} A promise that returns the provided connection
 */
function createUserTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(128) NOT NULL,
        age INT,
        PRIMARY KEY (id))`;
    return connection.query(stmt).then( () => connection);
}

/**
 * Create a user in the table. The user object should be in the form:
 * {
 *   username: '<username>',
 *   age: # years
 * }
 *
 * @param user The user to persist into the users table
 * @returns {Promise} A promise that returns the id of the row for the user
 */
function createUser(user) {
    var data = {
        username : user.username,
        age : parseInt(user.age) || null
    };
    console.log(data);
    return Promise.using(db.getConnection(), createUserTable)
        .then((connection) => {
            return connection.query('INSERT INTO users SET ?', data);
        })
        .then((result) => result.insertId);
}

/**
 * Retrieve all rows from the user table
 *
 * @returns {Promise} A promise that returns all of the rows in the table
 */
function getAllUsers() {
    return Promise.using(db.getConnection(), createUserTable)
        .then((connection) => {
            return connection.query('SELECT * FROM users');
        });
}

/**
 * Retrieve the user from the table with the specified id
 *
 * @param userId The id of the user to retrieve
 * @returns {Promise} A promise that returns the user or null if one wasn't found
 */
function findUser(userId) {
    return Promise.using(db.getConnection(), createUserTable)
        .then((conn) => {
            var stmt = mysql.format('SELECT * FROM users WHERE id = ?', [userId]);
            return conn.query(stmt);
        })
        .then((rows) => {
            return rows[0];
        });
}

/**
 * Delete the user from the table with the specified id
 *
 * @param userId The id of the user to delete
 * @returns {Promise} A promise that returns the result of the delete query
 */
function deleteUser(userId) {
    return Promise.using(db.getConnection(), createUserTable)
        .then((conn) => {
            var del = mysql.format('DELETE FROM users where id = ?', [userId]);
            return conn.query(del);
        });
}

module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.findUser = findUser;
module.exports.deleteUser = deleteUser;

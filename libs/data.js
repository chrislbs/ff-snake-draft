const mysql = require('promise-mysql');
const Promise = require('bluebird');
const db = require('./data/db');

const DEBUG = true;

function log() {
    if (DEBUG) {
        console.log.apply(this, arguments);
    }
}

/**
 * Create a user table unless it exists using the provided connection
 *
 * @param connection The connection to create the table on
 * @returns {Promise}
 */
function createUserTable(connection) {
    log('create table', arguments);
    return connection.query('CREATE TABLE IF NOT EXISTS users (username VARCHAR(15), age INT)')
        .then(function() {
            return connection;
        });
}

/**
 * Retrieve all rows in the user table
 *
 * @returns {Promise}
 */
function getUsers() {
    return Promise.using(db.getConnection(), createUserTable)
        .then(function (connection) {
            var res = connection.query('SELECT * FROM users');
            log('select args: ', arguments);
            return res;
        })
        .then(function (rows) {
            log('rows args :', arguments);
            return rows;
        });
}

/**
 * Create a user in the user table
 *
 * @param userObj An object that should be of the form { username : 'user', age : 30 }
 * @returns {Promise}
 */
function createUser(userObj) {
    return Promise.using(db.getConnection(), createUserTable)
        .then(function(connection) {
            connection.query('INSERT INTO users SET ?', userObj)
        })
}

module.exports.getUsers = getUsers;
module.exports.createUser = createUser;

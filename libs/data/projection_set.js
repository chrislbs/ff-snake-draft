'use strict';

const mysql = require('promise-mysql'),
    Promise = require('bluebird'),
    moment = require('moment'),
    db = require('./db'),
    _ = require('lodash');

/**
 * Create a projection set table
 *
 * @param connection
 * @returns {Promise.<T>|*}
 */
function createLoadTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS projection_set (
        id INT NOT NULL AUTO_INCREMENT,
        load_time TIMESTAMP NOT NULL,
        PRIMARY KEY (id));`;

    return connection.query(stmt).then( () => connection);
}

/**
 * Create a unique data load based off of the current time
 *
 * @returns {Promise.<T>} A promise that contains the id of the load on success
 */
function createLoad() {
    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    return Promise.using(db.getConnection(), createLoadTable)
        .then((connection) => {
            return connection.query('INSERT INTO projection_set SET ?', { load_time : now })
        })
        .then((result) => result.insertId)
}

/**
 * Return all of the project sets
 *
 * @returns {Promise.<T>}
 */
function getAll() {
    return Promise.using(db.getConnection(), createLoadTable)
        .then((conn) => conn.query('SELECT * from projection_set') )
        .then((rows) => {
            return _.map(rows, (row) => {
                return { id : row['id'], loadTime : row['load_time'] };
            });
        });
}

/**
 * Return the most recently created projection set
 *
 * @returns {Promise.<T>}
 */
function getLatest() {
    return Promise.using(db.getConnection(), createLoadTable)
        .then((conn) => conn.query('SELECT * from projection_set order by load_time desc limit 1') )
        .then((rows) => {
            var row = rows[0];
            return { id : row['id'], loadTime : row['load_time'] };
        });
}

module.exports.createLoad = createLoad;
module.exports.getAll = getAll;
module.exports.getLatest = getLatest;

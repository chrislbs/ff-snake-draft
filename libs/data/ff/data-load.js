'use strict';

const mysql = require('promise-mysql'),
    Promise = require('bluebird'),
    moment = require('moment'),
    db = require('./../db'),
    _ = require('lodash');

/**
 *
 * @param connection
 * @returns {Promise.<T>|*}
 */
function createLoadTable(connection) {
    var stmt = `
    CREATE TABLE IF NOT EXISTS ff_load (
        id INT NOT NULL AUTO_INCREMENT,
        load_time TIMESTAMP NOT NULL,
        PRIMARY KEY (id));`;

    return connection.query(stmt).then( () => connection);
}

/**
 * Create a unique data load based off of the current time
 *
 * @param connection The mysql connection to use
 * @returns {Promise.<T>} A promise that contains the id of the load on success
 */
function createLoad(connection) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    return createLoadTable(connection)
        .then((connection) => {
            return connection.query('INSERT INTO ff_load SET ?', { load_time : now })
        })
        .then((result) => result.insertId)
}

function getAll() {
    return Promise.using(db.getConnection(), createLoadTable)
        .then((conn) => conn.query('SELECT * from ff_load') )
        .then((rows) => {
            return _.map(rows, (row) => {
                return { id : row['id'], loadTime : row['load_time'] };
            });
        });
}

function getLatest() {
    return Promise.using(db.getConnection(), createLoadTable)
        .then((conn) => conn.query('SELECT * from ff_load order by load_time desc limit 1') )
        .then((rows) => {
            var row = rows[0];
            return { id : row['id'], loadTime : row['load_time'] };
        });
}

module.exports.createLoad = createLoad;
module.exports.getAll = getAll;
module.exports.getLatest = getLatest;

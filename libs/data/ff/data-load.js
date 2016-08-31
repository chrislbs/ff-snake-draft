'use strict';

const mysql = require('promise-mysql'),
    moment = require('moment'),
    db = require('./../db');

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

module.exports.createLoad = createLoad;

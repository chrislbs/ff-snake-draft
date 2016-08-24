'use strict';

const mysql = require('promise-mysql'),
    config = require('getconfig');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

/**
 * Retrieve a promised connection from a connection pool that will be released at the end of the
 * promise chain
 */
function getConnection() {
    return pool.getConnection().disposer(function(connection) {
        pool.releaseConnection(connection);
    });
}

process.on('SIGTERM', function() { pool.end(); });
process.on('SIGINT', function() { pool.end(); });

module.exports.getConnection = getConnection;

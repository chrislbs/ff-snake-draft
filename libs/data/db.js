'use strict';

const mysql = require('promise-mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost',
    user: 'root',
    password: process.env.MYSQL_ENV_MYSQL_ROOT_PASSWORD || 'root',
    database: process.env.MYSQL_ENV_MYSQL_DATABASE || 'ff'
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

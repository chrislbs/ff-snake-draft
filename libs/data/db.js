const mysql = require('promise-mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ff'
});

/**
 * Retrieve a promised connection from a connection pool that will be released at the end of the
 * promise chain
 */
function getConnection() {
    return pool.getConnection().disposer(function(connection) {
        pool.releaseConnection(connection)
    });
}

process.on('SIGTERM', function() { pool.end() });
process.on('SIGINT', function() { pool.end() });

module.exports.getConnection = getConnection;

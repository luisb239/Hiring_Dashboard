'use strict'

const
    config = require("../config/config")


module.exports = {
    connect: connect
}

/**
 *
 * @returns {Promise<PoolConnection>}
 */
async function connect() {
    if (config.sgbd === "mysql") {
        const mariadb = require('mariadb')
        let connection

        try {
            connection = await mariadb.createConnection(config.database_opts)
            return connection

        } catch (err) {

            console.log('unable to connect')

            throw err;
        }

    } else {

        const {Pool} = require('pg')

        var pool

        try {

            pool = new Pool(config.database_opts)
            return pool
        } catch (err) {

            console.log('unable to connect')

            throw err;
        }
    }
}

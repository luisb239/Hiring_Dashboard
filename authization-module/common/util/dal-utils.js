'use strict'

const db = require('./db'),
    errors = require('../errors/app-errors'),
    config = require('../config/config'),

    formatQueryForPG = async (statement) => {
        var wildCardIndex = 1
        var newStatement = ""

        Array.from(statement).forEach(char => {

            if (char == '?') {
                wildCardIndex++
                newStatement += `$${wildCardIndex - 1}`
                return
            }

            newStatement += char
        })

        return newStatement
    }

module.exports = {

    /**
     * Establishes connection to the database using the db module, after it has been established it runs the query
     passed via parameter.
     If a connection or query error occurs it catches them printing the given error and throwing the error
     * @param query
     * @returns {Promise<void>}
     */
    executeQuery: async (query) => {
        var connection

        try {
            try {
                connection = await db.connect()
            } catch (error) {
                throw errors.dbConnection
            }

            query.statement = config.sgbd === "mysql" ? query.statement : await formatQueryForPG(query.statement)
            return config.sgbd === "mysql" ?
                await connection.query(query.statement, query.params) :
                (await connection.query(query.statement, query.params)).rows;
        } catch (error) {
            throw errors.errorExecutingQuery(`${error.message} on query ${query.description}`)
        } finally {
            connection.end()
        }
    },

    /**
     * @param query
     * @returns {Promise<unknown>}
     */
    executeQueryWithReturn: (query) => {
        var connection;
        return db.connect()
            .catch(err => { throw errors.dbConnection })
            .then(con => {
                connection = con;
                return con.query(query.statement, query.params)
            })
            .catch(err => { throw errors.errorExecutingQuery(`${error.message} on query ${query.description}`) })
            .then(data => {
                if (data.length) {
                    return data
                }
                throw errors.noUsersFound
            })
            .finally(() => { connection.end() }) //nunca retornar no finnally!
            ;
    },

    /**
     * Util function that tests given predicate and throws given error if the predicate returns true
     * @param predicate
     * @param error
     */
    throwErrorIfNecessary: (predicate, error) => {
        if (predicate.call()) {
            throw error
        }

    }

}

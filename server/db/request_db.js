'use strict';

module.exports = (query, entities) => {

    return {
        getRequests : getRequests,
        postProperty : postProperty,
        findPropertyByKey : findPropertyByKey
    }

    function getRequests(text) {
        return query(`SELECT * FROM ${entities.request.table} WHERE ${text};`)
            .then(res => res.rows)
    }

    function postProperty(table, value) {
        return query(`INSERT INTO ${entities.request.table} VALUES ($1) RETURNING * ;`, [value])
            .then(res => res.rows)
    }

    function findPropertyByKey(table, value, key) {
        return query(`SELECT * FROM ${entities.request.table} WHERE ${key} = $1;`, [value])
            .then(res => res.rowCount === 0 ? undefined : res.rows)
    }

}
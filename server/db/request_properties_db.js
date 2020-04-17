'use strict';

module.exports = (query) => {

    return {
        getProperties : getProperties,
        postProperty : postProperty,
        findPropertyByKey : findPropertyByKey
    }

    function getProperties(table) {
        return query(`SELECT * FROM ${table};`)
            .then(res => res.rows)
    }

    function postProperty(table, value) {
        return query(`INSERT INTO ${table} VALUES ($1) RETURNING * ;`, [value])
            .then(res => res.rows)
    }

    function findPropertyByKey(table, key, value) {
        return query(`SELECT * FROM ${table} WHERE ${key} = $1;`, [value])
            .then(res => res.rowCount === 0 ? undefined : res.rows)
    }

}
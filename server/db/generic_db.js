'use strict'

module.exports = (query) => {
    function getAll(entity) {
        return query(`SELECT * FROM ${entity}`)
            .then(res => res)
            .catch(err => {
                console.log(err.stack)
            })
    }

    function post(entity, key) {
        return query(`INSERT INTO ${entity}(id) VALUES ($1) RETURNING *`, [key])
            .then(res => res)
            .catch(err => {
                console.log(err.stack)
            })
    }

    return {
        getAll: getAll,
        post: post
    }
}
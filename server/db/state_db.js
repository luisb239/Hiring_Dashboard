'use strict'

module.exports = (query) => {
    function getAllStates() {
        return query('SELECT * FROM request_state')
            .then(res => res)
            .catch(err => {
                console.log(err.stack)
            })
    }

    function postState(name) {
        return query('INSERT INTO request_state(request_state) VALUES ($1) RETURNING *', [name])
            .then(res => res)
            .catch(err => {
                console.log(err.stack)
            })
    }

    return {
        getAllStates: getAllStates,
        postState: postState
    }
}
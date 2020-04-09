'use strict'

module.exports = (query) => {
    function getAllStates(){
                return query('SELECT * FROM request_state')
                    .then(res => res)
                    .catch(err => {
                        console.log(err.stack)
                    })
            }
    return {
        getAllStates: getAllStates
    }
}
'use strict'

module.exports = (query) => {
    function getAllStates(){
                return query('SELECT * FROM request_state')
                    .then(res => {
                        const result = res.rows
                        console.log(result)
                        return result
                    })
                    .catch(err => {
                        console.log(err.stack)
                    })
            }
    return {
        getAllStates: getAllStates
    }
}
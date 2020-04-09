'use strict'

module.exports = (pool) => {
    function getAllStates(){
        pool
            .connect()
            .then(client => {
                return client
                    .query('SELECT * FROM states')
                    .then(res => {
                        client.release()
                        console.log(res.rows.map(s => s.state))
                    })
                    .catch(err => {
                        client.release()
                        console.log(err.stack)
                    })
            })
    }
    return {
        getAllStates: getAllStates
    }
}
'use strict'

module.exports = (db) => {
    function responseHandler(message, status_code, result){
        return {
            message: message,
            status_code: status_code,
            result: result
        }
    }
    return {
        states: require('./state_services.js')(db.states, responseHandler)
    }
}
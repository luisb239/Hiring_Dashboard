'use strict'

module.exports = (db) => {
    return {
        states: require('./state_services.js')(db.states)
    }
}
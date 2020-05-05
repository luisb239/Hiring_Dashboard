'use strict'

module.exports = (db) => {

    return {getStates, }

    async function getStates() {
        return await db.getStates()
    }
}

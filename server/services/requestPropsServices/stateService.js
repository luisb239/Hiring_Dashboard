'use strict'

module.exports = (db) => {

    return {getStates, }

    async function getStates() {
        const states = await db.getStates()
        return {states : states}
    }
}

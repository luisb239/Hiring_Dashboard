'use strict'

module.exports = (db) => {

    return {getLanguages}

    async function getLanguages() {
        return await db.getLanguages()
    }
}

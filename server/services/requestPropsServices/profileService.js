'use strict'

module.exports = (db) => {

    return {getProfiles}

    async function getProfiles() {
        return await db.getProfiles()
    }
}

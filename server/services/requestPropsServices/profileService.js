'use strict'

module.exports = (db) => {

    return {getProfiles}

    async function getProfiles() {
        const profiles = await db.getProfiles()
        return {profiles : profiles}
    }
}

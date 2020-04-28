'use strict'

module.exports = (db) => {

    return {getSkills}

    async function getSkills() {
        return await db.getSkills()
    }
}

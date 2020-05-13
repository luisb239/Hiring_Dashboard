'use strict'

module.exports = (db) => {

    return {getLanguages}

    async function getLanguages() {
        const languages = await db.getLanguages()
        return {languages : languages}
    }
}

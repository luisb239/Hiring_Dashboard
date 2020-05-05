'use strict'

module.exports = (db) => {

    return {getProjects}

    async function getProjects() {
        return await db.getProjects()
    }
}

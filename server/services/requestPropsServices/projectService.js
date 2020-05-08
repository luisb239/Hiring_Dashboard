'use strict'

module.exports = (db) => {

    return {getProjects}

    async function getProjects() {
        const projects = await db.getProjects()
        return {projects : projects}
    }
}

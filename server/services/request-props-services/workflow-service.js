'use strict'

module.exports = (db) => {

    return {getWorkflows}

    async function getWorkflows() {
        const workflows = await db.getWorkflows()
        return {workflows : workflows}
    }
}

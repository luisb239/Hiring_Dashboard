'use strict'

module.exports = (db) => {

    return {getWorkflows}

    async function getWorkflows() {
        return await db.getWorkflows()
    }
}

'use strict'

module.exports = (db) => {

    return {getStatesCsl}

    async function getStatesCsl() {
        return await db.getStatesCsl()
    }
}

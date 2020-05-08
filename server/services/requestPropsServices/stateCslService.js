'use strict'

module.exports = (db) => {

    return {getStatesCsl}

    async function getStatesCsl() {
        const statesCsl = await db.getStatesCsl()
        return {statesCsl : statesCsl}
    }
}

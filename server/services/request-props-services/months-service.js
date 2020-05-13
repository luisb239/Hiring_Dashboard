'use strict'

module.exports = (db) => {

    return {getMonths}

    async function getMonths() {
        const months = await db.getMonths()
        return {months: months}
    }
}

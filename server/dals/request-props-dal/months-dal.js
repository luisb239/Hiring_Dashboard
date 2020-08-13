'use strict'

const schema = require('../dal-schemas/request-props-schemas/months-schema.js')

module.exports = (query) => {

    return {getMonths}

    async function getMonths() {
        const statement = {
            name: 'Get Months',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            month: obj[schema.month]
        }
    }
}

'use strict'

const schema = require('../../schemas/requestAttrSchemas/stateSchema.js')

module.exports = (query) => {

    return {getStates}

    async function getStates() {
        const statement = {
            name: 'Get States',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            state : obj[schema.state]
        }
    }
}

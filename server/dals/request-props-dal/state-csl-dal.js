'use strict'

const schema = require('../dal-schemas/request-props-schemas/state-csl-schema.js')

module.exports = (query) => {

    return {getStatesCsl}

    async function getStatesCsl() {
        const statement = {
            name: 'Get Csl States',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            stateCsl : obj[schema.stateCsl]
        }
    }
}

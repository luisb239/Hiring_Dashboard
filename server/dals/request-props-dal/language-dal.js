'use strict'

const schema = require('../dal-schemas/request-props-schemas/language-schema.js')

module.exports = (query) => {

    return {getLanguages}

    async function getLanguages() {
        const statement = {
            name: 'Get Languages',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            language : obj[schema.language]
        }
    }
}

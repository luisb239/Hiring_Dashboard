'use strict'

const schema = require('../schemas/request-language-schema.js')
module.exports = (query) => {

    return {
        createRequestLanguageRequirement
    }

    function extract(row) {
        return {
            requestId: row[schema.requestId],
            language: row[schema.language],
            isMandatory: row[schema.isMandatory]
        }
    }

    async function createRequestLanguageRequirement({requestId, language, isMandatory}) {
        const statement = {
            name: 'Create Language Requirement in Request',
            text:
                `INSERT INTO ${schema.table} ` +
                `(${schema.requestId}, ${schema.language}, ${schema.isMandatory}) ` +
                `VALUES ($1, $2, $3) RETURNING *;`,
            values: [requestId, language, isMandatory]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))[0]
    }

}

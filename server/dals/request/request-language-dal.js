'use strict'

const schema = require('../dal-schemas/request-language-schema.js')
module.exports = (query) => {

    return {
        createLanguageRequirement: createLanguageRequirement,
        getRequestLanguages: getRequestLanguages,
        deleteLanguageRequirement: deleteLanguageRequirement
    }

    function extract(row) {
        return {
            requestId: row[schema.requestId],
            language: row[schema.language],
            isMandatory: row[schema.isMandatory]
        }
    }

    async function createLanguageRequirement({requestId, language, isMandatory}) {
        const statement = {
            name: 'Create Language Requirement in Request',
            text:
                `INSERT INTO ${schema.table} ` +
                `(${schema.requestId}, ${schema.language}, ${schema.isMandatory}) ` +
                `VALUES ($1, $2, $3);`,
            values: [requestId, language, isMandatory]
        }

        const result = await query(statement)
        return result.rowCount
    }

    async function getRequestLanguages({requestId}) {
        const statement = {
            name: 'Get Request languages',
            text:
                `SELECT * FROM ${schema.table} ` +
                `WHERE ${schema.requestId} = $1;`,
            values: [requestId]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function deleteLanguageRequirement({requestId, language, isMandatory}) {
        const statement = {
            name: 'Delete Language Requirement in Request',
            text:
                `DELETE FROM ${schema.table} ` +
                `WHERE ${schema.requestId} = $1 ` +
                `AND ${schema.language} = $2 ` +
                `AND ${schema.isMandatory} = $3;`,
            values: [requestId, language, isMandatory]
        }

        const res = await query(statement)
        return res.rowCount
    }

}

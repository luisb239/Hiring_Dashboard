'use strict'

const schema = require('../../schemas/process/process-info-schema')

module.exports = (query) => {

    return {
        getProcessInfos,
        createProcessInfo,
        updateProcessInfo
    }

    async function getProcessInfos({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Infos',
            text:
                `SELECT * FROM ${schema.table} AS I ` +
                `WHERE I.${schema.requestId} = $1 AND I.${schema.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessInfo(row))
    }

    function extractProcessInfo(row) {
        return {
            name: row[schema.name],
            value: row[schema.value]
        }
    }

    async function createProcessInfo() {

    }

    async function updateProcessInfo() {

    }

}


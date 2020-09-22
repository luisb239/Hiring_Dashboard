'use strict'

const schema = require('../dal-schemas/process/process-info-schema')

module.exports = (query) => {

    return {
        getProcessInfos: getProcessInfos,
        createProcessInfo: createProcessInfo,
        updateProcessInfoValue: updateProcessInfoValue
    }

    async function getProcessInfos({requestId, candidateId, client}) {
        const statement = {
            name: 'Get Process Infos',
            text:
                `SELECT * FROM ${schema.table} AS I ` +
                `WHERE I.${schema.requestId} = $1 AND I.${schema.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement, client)
        return result.rows.map(row => extractProcessInfo(row))
    }

    function extractProcessInfo(row) {
        return {
            name: row[schema.name],
            value: row[schema.value].value
        }
    }

    async function createProcessInfo({requestId, candidateId, infoName, infoValue, client}) {
        const statement = {
            name: 'Create Process Info',
            text:
                `INSERT INTO ${schema.table} ` +
                `(${schema.requestId}, ${schema.candidateId}, ${schema.name}, ${schema.value}) ` +
                `VALUES ($1, $2, $3, jsonb_build_object('value', \'${infoValue}\'));`,
            values: [requestId, candidateId, infoName]
        }

        await query(statement, client)
    }

    async function updateProcessInfoValue({requestId, candidateId, infoName, infoValue, client}) {
        const statement = {
            name: 'Update Process Info',
            text:
                `UPDATE ${schema.table} SET ${schema.value} = jsonb_set(${schema.value}, '{value}', to_jsonb($1::text)) ` +
                `WHERE ${schema.requestId} = $2 AND ` +
                `${schema.candidateId} = $3 AND ${schema.name} = $4;`,
            values: [infoValue, requestId, candidateId, infoName]
        }

       await query(statement, client)
    }

}


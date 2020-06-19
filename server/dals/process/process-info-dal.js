'use strict'

const schema = require('../../schemas/process/process-info-schema')

module.exports = (query) => {

    return {
        getProcessInfos,
        getProcessInfoDetail,
        createProcessInfo,
        updateProcessInfoValue
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

    async function getProcessInfoDetail({requestId, candidateId, infoName}) {
        const statement = {
            name: 'Get Process Info Detail',
            text:
                `SELECT * FROM ${schema.table} AS I ` +
                `WHERE I.${schema.requestId} = $1 AND I.${schema.candidateId} = $2 ` +
                `AND I.${schema.name} = $3`,
            values: [requestId, candidateId, infoName]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return extractProcessInfo(result.rows[0])
        }
        return null
    }

    async function createProcessInfo({requestId, candidateId, infoName, infoValue}) {
        const statement = {
            name: 'Create Process Info',
            text:
                `INSERT INTO ${schema.table} ` +
                `(${schema.requestId}, ${schema.candidateId}, ${schema.name}, ${schema.value}) ` +
                `VALUES ($1, $2, $3, $4);`,
            values: [requestId, candidateId, infoName, infoValue]
        }

        await query(statement)
    }

    async function updateProcessInfoValue({requestId, candidateId, infoName, infoValue}) {
        const statement = {
            name: 'Update Process Info',
            text:
                `UPDATE ${schema.table} SET ${schema.value} = $1 ` +
                `WHERE ${schema.requestId} = $2 AND ` +
                `${schema.candidateId} = $3 AND ${schema.name} = $4;`,
            values: [infoValue, requestId, candidateId, infoName]
        }

        await query(statement)
    }

}


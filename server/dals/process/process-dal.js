'use strict'

const process = require('../../schemas/process/process-schema.js')

module.exports = (query) => {

    return {
        getProcessStatus,
        createProcess,
        getCandidateProcesses,
        updateProcessStatus,
        getAllProcessesStatusFromRequest,
        updateProcess
    }

    async function getCandidateProcesses({candidateId}) {
        const statement = {
            name: 'Get Candidate Processes',
            text:
                `SELECT P.${process.status}, P.${process.requestId} ` +
                `FROM ${process.table} AS P ` +
                `WHERE P.${process.candidateId} = $1 ;`,
            values: [candidateId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessAndRequestInfo(row))
    }

    function extractProcessAndRequestInfo(row) {
        return {
            status: row[process.status],
            requestId: row[process.requestId]
        }
    }

    async function updateProcessStatus({requestId, candidateId, status}) {
        const statement = {
            name: 'Update Process Status',
            text:
                `UPDATE ${process.table} SET ${process.status} = $1 ` +
                `WHERE ${process.requestId} = $2 AND ${process.candidateId} = $3;`,
            values: [status, requestId, candidateId]
        }

        const result = await query(statement)
        return result.rowCount > 0
    }

    async function updateProcess({requestId, candidateId, status = null, timestamp, client}) {
        const statement = {
            name: 'Update Process',
            text:
                `UPDATE ${process.table} ` +
                `SET ${process.status} = COALESCE($1, ${process.status}), ${process.timestamp} = $2 ` +
                `WHERE ${process.requestId} = $3 AND ${process.candidateId} = $4 AND ${process.timestamp} < $2;`,
            values: [status, timestamp, requestId, candidateId]
        }

        const result = await query(statement, client)
        return result.rowCount
    }


    async function getAllProcessesStatusFromRequest({requestId}) {
        const statement = {
            name: 'Get All Processes Status From Request',
            text:
                `SELECT P.${process.status} ` +
                `FROM ${process.table} as P ` +
                `WHERE P.${process.requestId} = $1;`,
            values: [requestId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessStatus(row))
    }

    async function createProcess({requestId, candidateId, status}) {
        const statement = {
            name: 'Create Process',
            text:
                `INSERT INTO ${process.table} (${process.requestId}, ${process.candidateId}, ${process.status}) ` +
                `VALUES ($1, $2, $3);`,
            values: [requestId, candidateId, status]
        }

        await query(statement)
    }


    async function getProcessStatus({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Status',
            text:
                `SELECT * FROM ${process.table} AS P ` +
                `WHERE P.${process.requestId} = $1 AND P.${process.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return extractProcessStatus(result.rows[0])
        }

        return null
    }

    function extractProcessStatus(row) {
        return {
            status: row[process.status]
        }
    }

}

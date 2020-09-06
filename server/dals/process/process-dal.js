'use strict'

const process = require('../dal-schemas/process/process-schema.js')

module.exports = (query) => {

    return {
        getProcessStatusAndTimestamp: getProcessStatusAndTimestamp,
        createProcess: createProcess,
        getCandidateProcesses: getCandidateProcesses,
        getAllProcessesStatusFromRequest: getAllProcessesStatusFromRequest,
        updateProcess: updateProcess
    }

    async function getCandidateProcesses({candidateId}) {
        const statement = {
            name: 'Get Candidate Processes',
            text:
                `SELECT P.* ` +
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
            requestId: row[process.requestId],
            timestamp: row[process.timestamp]
        }
    }

    async function updateProcess({requestId, candidateId, status = null, timestamp, client}) {
        const statement = {

            name: 'Update Process',
            text:
                `UPDATE ${process.table} ` +
                `SET ${process.status} = COALESCE($1, ${process.status}), ` +
                `${process.timestamp} = CURRENT_TIMESTAMP ` +
                `WHERE ${process.requestId} = $3 AND ${process.candidateId} = $4 AND ${process.timestamp} = $2 ` +
                `RETURNING ${process.timestamp};`,
            values: [status, timestamp, requestId, candidateId]
        }

        const result = await query(statement, client)
        if (result.rowCount) {
            return extractTimestamp(result.rows[0])
        }
        return null
    }


    async function getAllProcessesStatusFromRequest({requestId, client}) {
        const statement = {
            name: 'Get All Processes Status From Request',
            text:
                `SELECT P.${process.status} ` +
                `FROM ${process.table} as P ` +
                `WHERE P.${process.requestId} = $1;`,
            values: [requestId]
        }

        const result = await query(statement, client)
        return result.rows.map(row => extractProcessStatusAndTimestamp(row))
    }

    async function createProcess({requestId, candidateId, status, client}) {
        const statement = {
            name: 'Create Process',
            text:
                `INSERT INTO ${process.table} (${process.requestId}, ` +
                `${process.candidateId}, ${process.status}, ${process.timestamp}) ` +
                `VALUES ($1, $2, $3, CURRENT_TIMESTAMP);`,
            values: [requestId, candidateId, status]
        }

        const res = await query(statement, client)
        return res.rowCount
    }


    async function getProcessStatusAndTimestamp({requestId, candidateId, client}) {
        const statement = {
            name: 'Get Process Status',
            text:
                `SELECT * FROM ${process.table} AS P ` +
                `WHERE P.${process.requestId} = $1 AND P.${process.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement, client)

        if (result.rowCount) {
            return extractProcessStatusAndTimestamp(result.rows[0])
        }
        return null
    }

    function extractTimestamp(row) {
        return row[process.timestamp]
    }

    function extractProcessStatusAndTimestamp(row) {
        return {
            status: row[process.status],
            timestamp: row[process.timestamp]
        }
    }

}

'use strict'

const process = require('../dal-schemas/process/process-schema.js')

module.exports = (query, moment) => {

    return {
        getProcessStatus,
        createProcess,
        getCandidateProcesses,
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

    async function updateProcess({
                                     requestId, candidateId, status = null, timestamp,
                                     newTimestamp = moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'), client
                                 }) {
        const statement = {
            name: 'Update Process',
            text:
                `UPDATE ${process.table} ` +
                `SET ${process.status} = COALESCE($1, ${process.status}), ${process.timestamp} = $5 ` +
                `WHERE ${process.requestId} = $3 AND ${process.candidateId} = $4 AND ${process.timestamp} < $2;`,
            values: [status, timestamp, requestId, candidateId, newTimestamp]
        }

        const result = await query(statement, client)
        return result.rowCount
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
        return result.rows.map(row => extractProcessStatus(row))
    }

    async function createProcess({requestId, candidateId, status, newTimestamp = moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS'), client}) {
        const statement = {
            name: 'Create Process',
            text:
                `INSERT INTO ${process.table} (${process.requestId}, ` +
                `${process.candidateId}, ${process.status}, ${process.timestamp}) ` +
                `VALUES ($1, $2, $3, $4);`,
            values: [requestId, candidateId, status, newTimestamp]
        }

        const res = await query(statement, client)
        return res.rowCount
    }


    async function getProcessStatus({requestId, candidateId, client}) {
        const statement = {
            name: 'Get Process Status',
            text:
                `SELECT * FROM ${process.table} AS P ` +
                `WHERE P.${process.requestId} = $1 AND P.${process.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement, client)

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

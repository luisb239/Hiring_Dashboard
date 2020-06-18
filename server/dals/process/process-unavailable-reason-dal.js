'use strict'

const schema = require('../../schemas/process/process-unavailable-reasons-schema.js')

module.exports = (query) => {

    return {
        getProcessUnavailableReason,
        setProcessInitialUnavailableReason,
        updateProcessUnavailableReason
    }


    async function getProcessUnavailableReason({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Unavailable Reasons',
            text:
                `SELECT * FROM ${schema.table} AS R ` +
                `WHERE R.${schema.requestId} = $1 AND R.${schema.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return extractProcessUnavailableReason(result.rows[0])
        }
        return null
    }

    function extractProcessUnavailableReason(row) {
        return {
            unavailabilityReason: row[schema.reason]
        }
    }


    async function setProcessInitialUnavailableReason({requestId, candidateId, reason}) {
        const statement = {
            name: 'Set Process Initial Unavailable Reason',
            text:
                `INSERT INTO ${schema.table} ` +
                `(${schema.requestId}, ${schema.candidateId}, ${schema.reason}) ` +
                `VALUES ($1, $2, $3);`,
            values: [requestId, candidateId, reason]
        }
        const result = await query(statement)

        return result.rowCount > 0
    }

    async function updateProcessUnavailableReason({requestId, candidateId, reason}) {
        const statement = {
            name: 'Update Process Unavailable Reason',
            text:
                `UPDATE ${schema.table} ` +
                `SET ${schema.reason} = $1 ` +
                `WHERE ${schema.requestId} = $2 AND ${schema.candidateId} = $3;`,
            values: [requestId, candidateId, reason]
        }
        const result = await query(statement)

        return result.rowCount > 0
    }

}

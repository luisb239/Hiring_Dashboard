'use strict'

const process = require('../schemas/process/process-schema.js')
const processPhase = require('../schemas/process/process-phase-schema.js')
const reason = require('../schemas/process/process-unavailable-reasons-schema.js')
const info = require('../schemas/process/process-info-schema.js')

module.exports = (query) => {

    return {
        getPhasesOfProcess,
        getProcessStatus,
        getProcessUnavailableReasons,
        getProcessInfos
    }

    async function getPhasesOfProcess({requestId, candidateId, currentPhase = null}) {
        const statement = {
            name: 'Get Phases Of Process',
            text:
                `SELECT ProcPhase.* FROM ${process.table} AS Proc ` +
                `INNER JOIN ${processPhase.table} AS ProcPhase ` +
                `ON Proc.${process.requestId} = ProcPhase.${processPhase.requestId} ` +
                `AND Proc.${process.candidateId} = ProcPhase.${processPhase.candidateId} ` +
                `WHERE Proc.${process.requestId} = $1 AND Proc.${process.candidateId} = $2 ` +
                `AND (ProcPhase.${processPhase.isCurrentPhase} = $3 OR $3 is null);`,
            values: [requestId, candidateId, currentPhase]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessPhase(row))
    }

    function extractProcessPhase(row) {
        return {
            phase: row[processPhase.phase],
            startDate: new Date(row[processPhase.startDate]).toDateString(),
            updateDate: new Date(row[processPhase.updateDate]).toDateString(),
            notes: row[processPhase.notes],
            isCurrentPhase: row[processPhase.isCurrentPhase]
        }
    }


    async function getProcessStatus({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Info',
            text:
                `SELECT * FROM ${process.table} AS P ` +
                `WHERE P.${process.requestId} = $1 AND P.${process.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extractProcessStatus(row))[0]
        }
    }

    function extractProcessStatus(row) {
        return {
            status: row[process.status]
        }
    }

    async function getProcessUnavailableReasons({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Unavailable Reasons',
            text:
                `SELECT * FROM ${reason.table} AS R ` +
                `WHERE R.${reason.requestId} = $1 AND R.${reason.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessUnavailableReasons(row))
    }

    function extractProcessUnavailableReasons(row) {
        return {
            unavailabilityReason: row[reason.reason]
        }
    }

    async function getProcessInfos({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Infos',
            text:
                `SELECT * FROM ${info.table} AS I ` +
                `WHERE I.${info.requestId} = $1 AND I.${info.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessInfo(row))
    }

    function extractProcessInfo(row) {
        return {
            name: row[info.name],
            value: row[info.value]
        }
    }
}

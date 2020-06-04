'use strict'

const process = require('../schemas/process/process-schema.js')
const processPhase = require('../schemas/process/process-phase-schema.js')
const processCurrPhase = require('../schemas/process/process-current-phase.js')
const reason = require('../schemas/process/process-unavailable-reasons-schema.js')
const info = require('../schemas/process/process-info-schema.js')

module.exports = (query) => {

    return {
        getPhasesOfProcess,
        getProcessStatus,
        getProcessUnavailableReason,
        getProcessInfos,
        addPhaseToProcess,
        updateProcessCurrentPhase,
        getProcessCurrentPhase,
        setProcessInitialPhase: addProcessInitialPhase,
    }

    async function addPhaseToProcess({requestId, candidateId, phase, startDate, updateDate = null, notes = null}) {
        const statement = {
            name: 'Add Phase To Process',
            text:
                `INSERT INTO ${processPhase.table} ` +
                `(${processPhase.requestId}, ${processPhase.candidateId}, ` +
                `${processPhase.phase}, ${processPhase.startDate}, ${processPhase.updateDate}, ${processPhase.notes}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6);`,
            values: [requestId, candidateId, phase, startDate, updateDate, notes]
        }
        await query(statement)
    }

    async function updateProcessCurrentPhase({requestId, candidateId, phase}) {
        const statement = {
            name: 'Update Process Current Phase',
            text:
                `UPDATE ${processCurrPhase.table} ` +
                `SET ${processCurrPhase.currentPhase} = $1 ` +
                `WHERE ${processCurrPhase.requestId} = $2 AND ` +
                `${processCurrPhase.candidateId} = $3;`,
            values: [phase, requestId, candidateId]
        }
        await query(statement)
    }

    async function getProcessCurrentPhase({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Current Phase',
            text:
                `SELECT * FROM ${processCurrPhase.table} as PCP ` +
                `WHERE PCP.${processCurrPhase.requestId} = $1 AND ` +
                `PCP.${processCurrPhase.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return {
                currentPhase: result.rows[0][processCurrPhase.currentPhase]
            }
        }
        return null
    }

    async function addProcessInitialPhase({requestId, candidateId, initialPhase}) {
        const statement = {
            name: 'Add Process Initial Phase',
            text:
                `INSERT INTO ${processCurrPhase.table} ` +
                `(${processCurrPhase.requestId}, ${processCurrPhase.candidateId}, ${processCurrPhase.currentPhase}) ` +
                `VALUES ($1, $2, $3);`,
            values: [requestId, candidateId, initialPhase]
        }
        await query(statement)
    }


    async function getPhasesOfProcess({requestId, candidateId}) {
        const statement = {
            name: 'Get Phases Of Process',
            text:
                `SELECT ProcPhase.* FROM ${process.table} AS Proc ` +
                `INNER JOIN ${processPhase.table} AS ProcPhase ` +
                `ON Proc.${process.requestId} = ProcPhase.${processPhase.requestId} ` +
                `AND Proc.${process.candidateId} = ProcPhase.${processPhase.candidateId} ` +
                `WHERE Proc.${process.requestId} = $1 AND Proc.${process.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)
        return result.rows.map(row => extractProcessPhase(row))
    }

    function extractProcessPhase(row) {
        return {
            phase: row[processPhase.phase],
            startDate: new Date(row[processPhase.startDate]).toDateString(),
            updateDate: new Date(row[processPhase.updateDate]).toDateString(),
            notes: row[processPhase.notes]
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

        return null
    }

    function extractProcessStatus(row) {
        return {
            status: row[process.status]
        }
    }

    async function getProcessUnavailableReason({requestId, candidateId}) {
        const statement = {
            name: 'Get Process Unavailable Reasons',
            text:
                `SELECT * FROM ${reason.table} AS R ` +
                `WHERE R.${reason.requestId} = $1 AND R.${reason.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extractProcessUnavailableReasons(row))[0]
        }

        return null
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

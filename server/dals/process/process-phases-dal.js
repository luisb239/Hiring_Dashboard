'use strict'

const process = require('../../schemas/process/process-schema.js')
const processPhase = require('../../schemas/process/process-phase-schema.js')
const processCurrPhase = require('../../schemas/process/process-current-phase.js')

module.exports = (query) => {

    return {
        addPhaseToProcess,
        updateProcessCurrentPhase,
        setProcessInitialPhase,
        getProcessCurrentPhase,
        getProcessPhases
    }

    async function addPhaseToProcess({requestId, candidateId, phase, startDate}) {
        const statement = {
            name: 'Add Phase To Process',
            text:
                `INSERT INTO ${processPhase.table} ` +
                `(${processPhase.requestId}, ${processPhase.candidateId}, ` +
                `${processPhase.phase}, ${processPhase.startDate}, ${processPhase.updateDate}, ${processPhase.notes}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6);`,
            values: [requestId, candidateId, phase, startDate, null, null]
        }
        await query(statement)
    }

    async function updateProcessCurrentPhase({requestId, candidateId, phase}) {
        const statement = {
            name: 'Update Process Current Phase',
            text:
                `UPDATE ${processCurrPhase.table} ` +
                `SET ${processCurrPhase.currentPhase} = $1 ` +
                `WHERE ${processCurrPhase.requestId} = $2 AND ${processCurrPhase.candidateId} = $3;`,
            values: [phase, requestId, candidateId]
        }
        await query(statement)
    }

    async function setProcessInitialPhase({requestId, candidateId, initialPhase}) {
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
            return extractProcessCurrentPhase(result.rows[0])
        }
        return null
    }

    function extractProcessCurrentPhase(row) {
        return {
            currentPhase: row[processCurrPhase.currentPhase]
        }
    }


    async function getProcessPhases({requestId, candidateId}) {
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


}

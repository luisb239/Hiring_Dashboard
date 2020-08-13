'use strict'

const process = require('../dal-schemas/process/process-schema.js')
const processPhase = require('../dal-schemas/process/process-phase-schema.js')
const processCurrPhase = require('../dal-schemas/process/process-current-phase.js')

module.exports = (query) => {

    return {
        addPhaseToProcess,
        updateProcessCurrentPhase,
        setProcessInitialPhase,
        getProcessCurrentPhase,
        getProcessPhases,
        updatePhaseOfProcess
    }

    async function updatePhaseOfProcess({
                                            requestId, candidateId, phase,
                                            startDate = null, updateDate = new Date(),
                                            notes = null, client = null
                                        }) {
        const statement = {
            name: 'Update Phase Of Process',
            text:
                `UPDATE ${processPhase.table} SET ` +
                `${processPhase.startDate} = COALESCE($1, ${processPhase.startDate}), ` +
                `${processPhase.updateDate} = COALESCE($2, ${processPhase.updateDate}), ` +
                `${processPhase.notes} = COALESCE($3, ${processPhase.notes}) ` +
                `WHERE ${processPhase.requestId} = $4 AND ${processPhase.candidateId} = $5 ` +
                `AND ${processPhase.phase} = $6;`,
            values: [startDate, updateDate, notes, requestId, candidateId, phase]
        }

        const res = await query(statement, client)
        return res.rowCount
    }

    async function addPhaseToProcess({
                                         requestId, candidateId, phase, client,
                                         startDate = new Date(), updateDate = null,
                                         notes = null
                                     }) {
        const statement = {
            name: 'Add Phase To Process',
            text:
                `INSERT INTO ${processPhase.table} ` +
                `(${processPhase.requestId}, ${processPhase.candidateId}, ` +
                `${processPhase.phase}, ${processPhase.startDate}, ${processPhase.updateDate}, ${processPhase.notes}) ` +
                `VALUES ($1, $2, $3, $4, $5, $6);`,
            values: [requestId, candidateId, phase, startDate, updateDate, notes]
        }
        await query(statement, client)
    }


    // TODO -> CHANGE DAL FUNCTIONS TO NEW MODULE PROCESS-CURRENT-PHASE-DAL
    async function updateProcessCurrentPhase({requestId, candidateId, phase, client}) {
        const statement = {
            name: 'Update Process Current Phase',
            text:
                `UPDATE ${processCurrPhase.table} ` +
                `SET ${processCurrPhase.currentPhase} = $1 ` +
                `WHERE ${processCurrPhase.requestId} = $2 AND ${processCurrPhase.candidateId} = $3;`,
            values: [phase, requestId, candidateId]
        }
        const result = await query(statement, client)
        return result.rowCount
    }

    async function setProcessInitialPhase({requestId, candidateId, initialPhase, client}) {
        const statement = {
            name: 'Add Process Initial Phase',
            text:
                `INSERT INTO ${processCurrPhase.table} ` +
                `(${processCurrPhase.requestId}, ${processCurrPhase.candidateId}, ${processCurrPhase.currentPhase}) ` +
                `VALUES ($1, $2, $3);`,
            values: [requestId, candidateId, initialPhase]
        }
        await query(statement, client)
    }

    async function getProcessCurrentPhase({requestId, candidateId, client}) {
        const statement = {
            name: 'Get Process Current Phase',
            text:
                `SELECT * FROM ${processCurrPhase.table} as PCP ` +
                `WHERE PCP.${processCurrPhase.requestId} = $1 AND ` +
                `PCP.${processCurrPhase.candidateId} = $2;`,
            values: [requestId, candidateId]
        }

        const result = await query(statement, client)

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


    async function getProcessPhases({requestId, candidateId, client}) {
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

        const result = await query(statement, client)
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

'use strict'

const workflowPhase = require('../schemas/workflow-phases-schemas/workflow-phase-schema.js')
const phaseSchema = require('../schemas/workflow-phases-schemas/phase-schema.js')

module.exports = (query) => {

    return {
        getPhasesByWorkflow, getPhase, getPhases
    }

    async function getPhases() {
        const statement = {
            name: 'Get Phases',
            text:
                `SELECT * FROM ${phaseSchema.table};`,
            values: []
        }
        const result = await query(statement)
        return result.rows.map(row => extractPhase(row))
    }

    async function getPhase({phase}) {
        const statement = {
            name: 'Get Phase',
            text:
                `SELECT * FROM ${phaseSchema.table} ` +
                `WHERE ${phaseSchema.phase} = $1;`,
            values: [phase]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extractPhase(row))[0]
        }
        return null
    }

    function extractPhase(row) {
        return {
            phase: row[phaseSchema.phase]
        }
    }

    async function getPhasesByWorkflow({workflow}) {
        const statement = {
            name: 'Get Phases By Workflow',
            text:
                `SELECT WP.* FROM ${workflowPhase.table} AS WP ` +
                `INNER JOIN ${phaseSchema.table} AS P ` +
                `ON P.${phaseSchema.phase} = WP.${workflowPhase.phase} ` +
                `WHERE WP.${workflowPhase.workflow} = $1 ` +
                `ORDER BY WP.${workflowPhase.phaseNumber} ASC ;`,
            values: [workflow]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            phase: obj[workflowPhase.phase],
            phaseNumber: obj[workflowPhase.phaseNumber]
        }
    }
}

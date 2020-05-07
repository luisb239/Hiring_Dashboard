'use strict'

const workflowPhase = require('../schemas/workflowPhaseSchema.js')
const phase = require('../schemas/phaseSchema.js')

module.exports = (query) => {

    return {
        getPhasesByWorkflow,
    }

    async function getPhasesByWorkflow({workflow}) {
        const statement = {
            name: 'Get Phases By Workflow',
            text:
                `SELECT P.* FROM ${workflowPhase.table} AS WP ` +
                `INNER JOIN ${phase.table} AS P ` +
                `ON P.${phase.phase} = WP.${workflowPhase.phase} ` +
                `WHERE WP.${workflowPhase.workflow} = $1 ` +
                `ORDER BY WP.${workflowPhase.phaseNumber} ASC ;`,
            values: [workflow]
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }


    function extract(obj) {
        return {
            phase : obj[phase.phase]
        }
    }
}

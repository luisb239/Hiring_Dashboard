'use strict'

const schema = require('../dal-schemas/request-props-schemas/workflow-schema.js')

module.exports = (query) => {

    return {getWorkflows, getWorkflow}

    async function getWorkflows() {
        const statement = {
            name: 'Get Workflows',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    async function getWorkflow({workflow}) {
        const statement = {
            name: 'Get Workflow',
            text:
                `SELECT * FROM ${schema.table} ` +
                `WHERE ${schema.workflow} = $1;`,
            values: [workflow]
        }
        const result = await query(statement)

        if (result.rowCount) {
            return result.rows.map(row => extract(row))[0]
        }
        return null
    }

    function extract(obj) {
        return {
            workflow: obj[schema.workflow]
        }
    }
}

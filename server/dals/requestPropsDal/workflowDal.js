'use strict'

const schema = require('../../schemas/requestAttrSchemas/workflowSchema.js')

module.exports = (query) => {

    return {getWorkflows}

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

    function extract(obj) {
        return {
            workflow : obj[schema.workflow]
        }
    }
}

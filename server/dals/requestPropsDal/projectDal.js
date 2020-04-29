'use strict'

const schema = require('../../schemas/requestAttrSchemas/projectSchema.js')

module.exports = (query) => {

    return {getProjects}

    async function getProjects() {
        const statement = {
            name: 'Get Projects',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            project : obj[schema.project]
        }
    }
}

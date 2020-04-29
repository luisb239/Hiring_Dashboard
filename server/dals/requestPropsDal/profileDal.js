'use strict'

const schema = require('../../schemas/requestAttrSchemas/profileSchema.js')

module.exports = (query) => {

    return {getProfiles}

    async function getProfiles() {
        const statement = {
            name: 'Get Profiles',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            profile : obj[schema.profile]
        }
    }
}

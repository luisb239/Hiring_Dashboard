'use strict'

const schema = require('../dal-schemas/request-props-schemas/skill-schema.js')

module.exports = (query) => {

    return {getSkills: getSkills}

    async function getSkills() {
        const statement = {
            name: 'Get Skills',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extract(row))
    }

    function extract(obj) {
        return {
            skill : obj[schema.skill]
        }
    }


}

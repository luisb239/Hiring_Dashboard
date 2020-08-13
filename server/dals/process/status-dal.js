'use strict'

const schema = require('../dal-schemas/process/status-schema.js')

module.exports = (query) => {

    return {
        getAllStatus
    }

    async function getAllStatus() {
        const statement = {
            name: 'Get All Status',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extractStatus(row))
    }


    function extractStatus(row) {
        return {
            status: row[schema.status]
        }
    }

}
